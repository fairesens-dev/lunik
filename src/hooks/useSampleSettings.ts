import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SampleSettings {
  enabled: boolean;
  unitPrice: number;
  shippingCost: number;
  maxSamples: number | null;
  promoMessage: string;
}

const defaults: SampleSettings = {
  enabled: false,
  unitPrice: 2,
  shippingCost: 0,
  maxSamples: null,
  promoMessage: "",
};

export function useSampleSettings() {
  return useQuery({
    queryKey: ["admin_settings", "samples"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_settings")
        .select("data")
        .eq("id", "samples")
        .single();
      if (!data?.data) return defaults;
      return { ...defaults, ...(data.data as Partial<SampleSettings>) };
    },
    staleTime: 60_000,
  });
}
