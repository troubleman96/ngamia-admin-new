import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type CatalogModel = {
  id: string;
  model: string;
  display_name: string;
  modality: string;
  input_modalities: string[];
  output_modalities: string[];
  supported_parameters: string[];
  context_window: number;
  input_price_per_1k_credits: number;
  output_price_per_1k_credits: number;
  image_price_per_unit_credits: number;
  request_price_credits: number;
};

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => api.get<CatalogModel[]>("/v1/models"),
  });
}