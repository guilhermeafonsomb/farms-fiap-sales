import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductsByPeriod } from "@/services/products";

export function useProductsByPeriod(period: "Semanal" | "Mensal" | "Anual") {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["products-sold", period],
    queryFn: () => fetchProductsByPeriod(period!),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["products-sold", period] });
  };

  return { ...query, invalidate };
}
