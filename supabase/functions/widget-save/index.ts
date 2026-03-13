import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, data } = await req.json();

    if (action === "sav") {
      // Upsert contact by email
      const { data: existingContacts } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", data.email)
        .limit(1);

      let contactId: string;
      if (existingContacts && existingContacts.length > 0) {
        contactId = existingContacts[0].id;
        if (data.phone) {
          await supabase.from("contacts").update({ phone: data.phone }).eq("id", contactId);
        }
      } else {
        const { data: newContact, error: contactError } = await supabase
          .from("contacts")
          .insert({
            email: data.email,
            first_name: data.email.split("@")[0],
            phone: data.phone || null,
            source: "sav_widget",
            status: "lead",
          })
          .select("id")
          .single();
        if (contactError) throw contactError;
        contactId = newContact.id;
      }

      // Insert activity
      await supabase.from("activities").insert({
        contact_id: contactId,
        type: "sav_request",
        subject: `Demande SAV - ${data.problem_category}`,
        body: `Commande: ${data.order_number}\nProblème: ${data.problem_category}\nDétail: ${data.problem_detail}\nEmail: ${data.email}`,
        metadata: {
          order_number: data.order_number,
          problem_category: data.problem_category,
          problem_detail: data.problem_detail,
          phone: data.phone || null,
        },
      });

      // Insert conversion
      await supabase.from("conversions").insert({
        contact_id: contactId,
        event_name: "sav_request_submitted",
        event_category: "sav",
        metadata: { order_number: data.order_number, problem_category: data.problem_category },
      });

      // Look up the order by ref and update it
      let orderFound = false;
      let orderStatus = "";
      let orderDate = "";

      const { data: orders } = await supabase
        .from("orders")
        .select("id, ref, status, status_history, notes, created_at")
        .eq("ref", data.order_number)
        .limit(1);

      if (orders && orders.length > 0) {
        const order = orders[0];
        orderFound = true;
        orderStatus = order.status;
        orderDate = order.created_at;

        const existingNotes = order.notes || "";
        const newNote = `\n[SAV ${new Date().toLocaleDateString("fr-FR")}] ${data.problem_category}: ${data.problem_detail} (email: ${data.email})`;

        const existingHistory = Array.isArray(order.status_history) ? order.status_history : [];
        const newHistoryEntry = {
          status: "SAV en cours",
          date: new Date().toISOString(),
          note: `Demande SAV - ${data.problem_category}`,
        };

        await supabase
          .from("orders")
          .update({
            notes: existingNotes + newNote,
            status: "SAV en cours",
            status_history: [...existingHistory, newHistoryEntry],
          })
          .eq("id", order.id);
      }

      return new Response(JSON.stringify({ success: true, order_found: orderFound, order_status: orderFound ? "SAV en cours" : undefined, order_date: orderDate || undefined }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "callback") {
      // Upsert contact
      const email = `callback-${data.phone.replace(/\s/g, "")}@widget.local`;
      const { data: existingContacts } = await supabase
        .from("contacts")
        .select("id")
        .eq("phone", data.phone)
        .limit(1);

      let contactId: string;
      if (existingContacts && existingContacts.length > 0) {
        contactId = existingContacts[0].id;
      } else {
        const { data: newContact, error: contactError } = await supabase
          .from("contacts")
          .insert({
            email,
            first_name: data.first_name,
            phone: data.phone,
            source: "callback_widget",
            status: "lead",
          })
          .select("id")
          .single();
        if (contactError) throw contactError;
        contactId = newContact.id;
      }

      // Save RGPD consent
      await supabase.from("contact_properties").insert({
        contact_id: contactId,
        property_key: "rgpd_consent",
        property_value: new Date().toISOString(),
      });

      // Save city
      if (data.city) {
        await supabase.from("contact_properties").insert({
          contact_id: contactId,
          property_key: "city",
          property_value: data.city,
        });
      }

      // Insert activity
      await supabase.from("activities").insert({
        contact_id: contactId,
        type: "callback_request",
        subject: "Demande de rappel",
        metadata: { phone: data.phone, city: data.city, first_name: data.first_name },
      });

      // Insert conversion
      await supabase.from("conversions").insert({
        contact_id: contactId,
        event_name: "callback_requested",
        event_category: "lead",
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "chat_transcript") {
      // Save chat transcript - find or create contact
      let contactId: string | null = null;
      if (data.email) {
        const { data: existing } = await supabase
          .from("contacts")
          .select("id")
          .eq("email", data.email)
          .limit(1);
        if (existing && existing.length > 0) contactId = existing[0].id;
      }

      if (!contactId) {
        const { data: newContact } = await supabase
          .from("contacts")
          .insert({
            email: data.email || `chatbot-${Date.now()}@widget.local`,
            first_name: "Visiteur",
            source: "direct",
            status: "visitor",
          })
          .select("id")
          .single();
        if (newContact) contactId = newContact.id;
      }

      if (contactId) {
        await supabase.from("activities").insert({
          contact_id: contactId,
          type: "chatbot_conversation",
          subject: "Session chatbot IA - Questions générales",
          body: JSON.stringify(data.transcript),
          metadata: { source: "widget", screen: "ai_chat", message_count: data.transcript?.length || 0 },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("widget-save error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
