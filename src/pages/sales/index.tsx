import { useQueryClient } from "@tanstack/react-query";
import { UpdateStock } from "@/components/UpdateStock";
import type { Product } from "@/model/product";
import { useProducts } from "@/hooks/useProducts";
import { useAddProduct } from "@/hooks/useAddProducts";
import { addSoldProduct, updateProductQuantity } from "@/services/produtos";
import { toast } from "react-toastify";
import { NewProduct } from "@/components/newProduct";
import { RegisterSale, type Sale } from "@/components/registerSale";

export const Sales = () => {
  const queryClient = useQueryClient();
  const { data: products } = useProducts();
  const { mutate: addProduct } = useAddProduct();

  const handleAddProduct = async (product: Product) => {
    try {
      addProduct({
        name: product.name,
        quantity: product.quantity,
        type: product.type,
      });

      toast.success("Produto adicionado!");
    } catch (error) {
      toast.error("Não foi possível adicionar o produto.");
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const updateStock = async (name: string, delta: number, showAlert = true) => {
    try {
      const product = products?.find((p) => p.name === name);

      if (!product) {
        toast.error("Produto não encontrado.");
        return;
      }

      const newQuantity = product.quantity + delta;

      await updateProductQuantity({
        productName: name,
        newQuantity: newQuantity,
      });

      await queryClient.invalidateQueries({ queryKey: ["produtos"] });

      if (showAlert) {
        toast.success("Estoque atualizado!");
      }
    } catch (error) {
      toast.error("Não foi possível atualizar o estoque.");
      console.error("Erro ao atualizar estoque:", error);
    }
  };

  const registerSale = async (sale: Sale) => {
    try {
      await addSoldProduct({
        productName: sale.product,
        quantity: sale.quantity,
        price: sale.price,
        period: sale.period,
        goals: sale.goals,
      });
      await updateStock(sale.product, -sale.quantity, false);
      toast.success("Venda registrada!");
    } catch (error) {
      toast.error("Não foi possível registrar a venda.");
      console.error("Erro ao registrar venda:", error);
    }
  };
  return (
    <section>
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-black text-2xl font-bold mb-6">Estoque e Vendas</p>

        <NewProduct onAdd={handleAddProduct} />
        <UpdateStock onUpdate={updateStock} />
        <RegisterSale onRegister={registerSale} />

        <div className="max-w-md w-full">
          <p className="text-lg text-black font-semibold mb-3">
            Produtos em Estoque
          </p>
          {products?.map((product) => (
            <div
              key={product.id}
              className="shadow-md shadow-primary-100 p-3 text-black  rounded-lg mb-2 bg-gray-50"
            >
              <p className="font-bold  ">{product.name}</p>
              <p>Quantidade: {product.quantity}</p>
              <p>Tipo: {product.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
