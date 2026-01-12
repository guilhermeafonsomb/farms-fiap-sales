import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { toast } from "react-toastify";

export type Sale = {
  product: string;
  quantity: number;
  price: number;
  period: "Semanal" | "Mensal" | "Anual";
  goals: number;
};

type RegisterSaleProps = {
  onRegister: (sale: Sale) => void;
};

export const RegisterSale: React.FC<RegisterSaleProps> = ({ onRegister }) => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState<"Semanal" | "Mensal" | "Anual">(
    "Semanal"
  );

  const [goals, setGoals] = useState(0);

  const handleRegister = () => {
    if (!product || !quantity || !price || !period || !goals || goals === 0) {
      toast.error("Erro: Preencha todos os campos");
      return;
    }
    onRegister({
      product,
      quantity: Number(quantity),
      price: Number(price),
      period,
      goals,
    });
    setProduct("");
    setQuantity("");
    setPrice("");
    setPeriod("Semanal");
    setGoals(0);
  };

  return (
    <section className="mb-10 max-w-md flex flex-col">
      <p className="text-lg text-black font-semibold mb-3">Registrar Venda</p>
      <Input
        placeholder="Produto"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <Input
        placeholder="Quantidade Vendida"
        type="numeric"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Input
        placeholder="Preço"
        type="numeric"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select
        className="rounded-lg p-3 mb-3 bg-primary-100 text-black"
        value={period}
        data-testid="period-select"
        onChange={(value) =>
          setPeriod(value.target.value as "Semanal" | "Mensal" | "Anual")
        }
      >
        <option label="Semanal" value="Semanal" />
        <option label="Mensal" value="Mensal" />
        <option label="Anual" value="Anual" />
      </select>
      <Input
        className="rounded-lg p-3 mb-3 bg-primary-100 green-50"
        placeholder="Meta"
        type="numeric"
        onChange={(e) => setGoals(Number(e.target.value))}
      />
      <Button onClick={handleRegister}>Registrar Venda</Button>
    </section>
  );
};
