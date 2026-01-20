import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { toast } from "react-toastify";
import { ErrorSummary } from "../error-summary";

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
  const [goals, setGoals] = useState(""); // Changed to string to handle empty input
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!product) newErrors["product-name"] = "O campo Produto é obrigatório";
    if (!quantity) newErrors["quantity"] = "O campo Quantidade é obrigatório";
    if (!price) newErrors["price"] = "O campo Preço é obrigatório";
    if (!goals) newErrors["goals"] = "O campo Meta é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    onRegister({
      product,
      quantity: Number(quantity),
      price: Number(price),
      period,
      goals: Number(goals),
    });
    setProduct("");
    setQuantity("");
    setPrice("");
    setPeriod("Semanal");
    setGoals("");
    setErrors({});
  };

  return (
    <section>
      <h2 className="text-lg text-black font-semibold mb-3">Registrar Venda</h2>
      <ErrorSummary errors={errors} />
      <form
        className="mb-10 max-w-md flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        noValidate
      >
        <label htmlFor="product-name" className="sr-only">
          Produto
        </label>
        <Input
          id="product-name"
          placeholder="Produto"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors["product-name"]}
          aria-describedby={
            errors["product-name"] ? "product-name-error" : undefined
          }
          className={errors["product-name"] ? "border-2 border-red-500" : ""}
        />
        {errors["product-name"] && (
          <span
            id="product-name-error"
            className="text-red-600 text-sm mb-2 -mt-2"
          >
            {errors["product-name"]}
          </span>
        )}

        <label htmlFor="quantity" className="sr-only">
          Quantidade Vendida
        </label>
        <Input
          id="quantity"
          placeholder="Quantidade Vendida"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors["quantity"]}
          aria-describedby={errors["quantity"] ? "quantity-error" : undefined}
          className={errors["quantity"] ? "border-2 border-red-500" : ""}
        />
        {errors["quantity"] && (
          <span id="quantity-error" className="text-red-600 text-sm mb-2 -mt-2">
            {errors["quantity"]}
          </span>
        )}

        <label htmlFor="price" className="sr-only">
          Preço
        </label>
        <Input
          id="price"
          placeholder="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors["price"]}
          aria-describedby={errors["price"] ? "price-error" : undefined}
          className={errors["price"] ? "border-2 border-red-500" : ""}
        />
        {errors["price"] && (
          <span id="price-error" className="text-red-600 text-sm mb-2 -mt-2">
            {errors["price"]}
          </span>
        )}

        <label htmlFor="period" className="sr-only">
          Período
        </label>
        <select
          id="period"
          className="rounded-lg p-3 mb-3 bg-primary-100 text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={period}
          data-testid="period-select"
          onChange={(value) =>
            setPeriod(value.target.value as "Semanal" | "Mensal" | "Anual")
          }
          aria-required="true"
        >
          <option label="Semanal" value="Semanal" />
          <option label="Mensal" value="Mensal" />
          <option label="Anual" value="Anual" />
        </select>

        <label htmlFor="goals" className="sr-only">
          Meta
        </label>
        <Input
          id="goals"
          className={`rounded-lg p-3 mb-3 bg-primary-100 green-50 ${
            errors["goals"] ? "border-2 border-red-500" : ""
          }`}
          placeholder="Meta"
          type="number"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors["goals"]}
          aria-describedby={errors["goals"] ? "goals-error" : undefined}
        />
        {errors["goals"] && (
          <span id="goals-error" className="text-red-600 text-sm mb-2 -mt-2">
            {errors["goals"]}
          </span>
        )}

        <Button type="submit">Registrar Venda</Button>
      </form>
    </section>
  );
};
