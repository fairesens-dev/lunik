import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, ref, customerEmail, customerName, productName, description, paymentMethod, orderData, promoCode, promoDiscount } =
      await req.json();

    if (!amount || !ref || !customerEmail) {
      throw new Error("Missing required fields: amount, ref, customerEmail");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") || "https://lunik.lovable.app";

    // Validate promo code if provided
    let validatedDiscount = 0;
    if (promoCode && promoDiscount) {
      const { data: promo } = await supabaseAdmin
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("active", true)
        .single();

      if (promo) {
        validatedDiscount = promoDiscount;
        // Increment usage
        await supabaseAdmin
          .from("promo_codes")
          .update({ current_uses: (promo.current_uses || 0) + 1 })
          .eq("id", promo.id);
      }
    }

    const finalAmount = Math.max(0, amount - validatedDiscount);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName || "Store Coffre Sur-Mesure",
              description: description || "",
            },
            unit_amount: finalAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // TODO: For 4x installments, replace with Alma API or Stripe installments in production
      payment_method_types: ["card"],
      success_url: `${origin}/merci?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(customerEmail)}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        ref,
        payment_method: paymentMethod || "card",
      },
    });

    // Insert order into Supabase with pending status
    if (orderData) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { data: insertedOrder, error: insertError } = await supabaseAdmin.from("orders").insert({
        ...orderData,
        amount: finalAmount,
        promo_code: promoCode || "",
        promo_discount: validatedDiscount,
        payment_status: "pending",
        stripe_payment_intent_id: session.id,
        status: "Nouveau",
        status_history: [{ status: "Nouveau", date: new Date().toISOString() }],
      }).select("id").single();

      if (insertError) {
        console.error("Order insert error:", insertError);
        // Don't throw - still redirect to payment
      }

      // Also insert a lead
      const nameParts = (orderData.client_name || "").replace(/^(M\.|Mme)\s*/, "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await supabaseAdmin.from("leads").insert({
        first_name: firstName,
        last_name: lastName,
        email: orderData.client_email,
        phone: orderData.client_phone || "",
        width: orderData.width,
        projection: orderData.projection,
        toile_color: orderData.toile_color || "",
        armature_color: orderData.armature_color || "",
        options: orderData.options || [],
        postal_code: orderData.client_postal_code || "",
        message: orderData.message || "",
      });

      // Mark abandoned cart as converted if email matches
      if (orderData?.client_email) {
        await supabaseAdmin
          .from("abandoned_carts")
          .update({ converted: true, converted_order_id: insertedOrder?.id || null })
          .eq("email", orderData.client_email)
          .eq("converted", false);
      }

      // Send confirmation + admin notification emails
      if (insertedOrder?.id) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

        const sendEmail = async (type: string) => {
          try {
            await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${serviceRoleKey}`,
              },
              body: JSON.stringify({ type, orderId: insertedOrder.id }),
            });
          } catch (e) {
            console.error(`Failed to send ${type} email:`, e);
          }
        };

        // Fire and forget - don't block checkout redirect
        sendEmail("confirmation");
        sendEmail("admin_new_order");
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
