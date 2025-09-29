import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type UpdateStockProps = {
  onUpdate: (name: string, delta: number) => void;
};

export const UpdateStock = ({ onUpdate }: UpdateStockProps) => {
  const [name, setName] = useState("");
  const [delta, setDelta] = useState("");

  const handleUpdate = () => {
    if (!name || !delta) {
      // Alert.alert("Erro", "Preencha todos os campos");
      alert("Erro: Preencha todos os campos");
      return;
    }
    onUpdate(name, Number(delta));
    setName("");
    setDelta("");
  };

  return (
    <section className="mb-10 max-w-md flex flex-col">
      <p className="text-lg font-semibold mb-3">Atualizar Estoque</p>
      <Input
        placeholder="Produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="+10 (entrada) ou -5 (saída)"
        type="numeric"
        value={delta}
        onChange={(e) => setDelta(e.target.value)}
      />
      <Button onClick={handleUpdate}>Atualizar Estoque</Button>
    </section>
  );
};
