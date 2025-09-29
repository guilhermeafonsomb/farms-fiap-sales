import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduto } from "../services/produtos";

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
