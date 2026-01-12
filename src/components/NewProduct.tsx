import { useState } from "react";
import { Button } from "./button/Button";
import { Input } from "./Input";
import { toast } from "react-toastify";
import type { Product } from "@/model/product";

type NewProductProps = {
  onAdd: (product: Product) => void;
};

export const NewProduct = ({ onAdd }: NewProductProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");

  const handleAdd = () => {
    if (!name || !quantity || !type) {
      toast.error("Erro: Preencha todos os campos");
      return;
    }
    onAdd({ name, quantity: Number(quantity), type });
    setName("");
    setQuantity("");
    setType("");
  };

  return (
    <section className="mb-10 max-w-md flex flex-col">
      <p className="text-lg text-black font-semibold mb-3">Novo Produto</p>
      <Input
        placeholder="Nome do Produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Quantidade"
        type="numeric"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Input
        placeholder="Tipo"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <Button onClick={handleAdd}>Adicionar Produto</Button>
    </section>
  );
};
