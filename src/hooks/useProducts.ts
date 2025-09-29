import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/produtos";

export function useProducts() {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProducts,
    refetchOnWindowFocus: false,
  });
}
