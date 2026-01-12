import { fireEvent, render, vi } from "@/test/test-utils";
import { NewProduct } from ".";

const mockOnAdd = vi.fn();
describe("NewProduct tests", () => {
  it("should render the component", () => {
    const { getByText } = render(<NewProduct onAdd={mockOnAdd} />);

    expect(getByText("Novo Produto")).toBeInTheDocument();
  });

  it("should call erro toast", () => {
    const { getByText, getByRole } = render(<NewProduct onAdd={mockOnAdd} />);

    const submitButton = getByRole("button", { name: "Adicionar Produto" });

    fireEvent.click(submitButton);

    expect(getByText("Erro: Preencha todos os campos")).toBeInTheDocument();
  });

  it("should call onAdd", () => {
    const { getByPlaceholderText, getByRole } = render(
      <NewProduct onAdd={mockOnAdd} />
    );

    const nameInput = getByPlaceholderText("Nome do Produto");
    const quantityInput = getByPlaceholderText("Quantidade");
    const typeInput = getByPlaceholderText("Tipo");

    fireEvent.change(nameInput, { target: { value: "Produto" } });
    fireEvent.change(quantityInput, { target: { value: "10" } });
    fireEvent.change(typeInput, { target: { value: "Tipo" } });

    const submitButton = getByRole("button", { name: "Adicionar Produto" });

    fireEvent.click(submitButton);

    expect(mockOnAdd).toHaveBeenCalled();
  });
});
