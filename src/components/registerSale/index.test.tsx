import { fireEvent, render, vi } from "@/test/test-utils";
import { RegisterSale } from ".";

const mockOnRegister = vi.fn();

describe("RegisterSale tests", () => {
  it("should render the component", () => {
    const { getByRole } = render(<RegisterSale onRegister={mockOnRegister} />);

    expect(
      getByRole("button", { name: "Registrar Venda" })
    ).toBeInTheDocument();
  });

  it("should render toast error", () => {
    const { getByRole, getByText } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    const submitButton = getByRole("button", { name: "Registrar Venda" });

    fireEvent.click(submitButton);

    expect(getByText("Erro: Preencha todos os campos")).toBeInTheDocument();
  });

  it("should call onRegister", () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    const productInput = getByPlaceholderText("Produto");
    const quantityInput = getByPlaceholderText("Quantidade Vendida");
    const priceInput = getByPlaceholderText("Preço");
    const goalsInput = getByPlaceholderText("Meta");
    const periodInput = getByTestId("period-select");

    fireEvent.change(productInput, { target: { value: "Produto" } });
    fireEvent.change(quantityInput, { target: { value: "10" } });
    fireEvent.change(priceInput, { target: { value: "10" } });
    fireEvent.change(goalsInput, { target: { value: "10" } });
    fireEvent.change(periodInput, { target: { value: "Semanal" } });

    const submitButton = getByRole("button", { name: "Registrar Venda" });

    fireEvent.click(submitButton);

    expect(mockOnRegister).toHaveBeenCalled();
  });
});
