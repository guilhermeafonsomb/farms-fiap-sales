import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "@/services/products";

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
