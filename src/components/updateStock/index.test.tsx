import { fireEvent, render, vi } from "@/test/test-utils";
import { UpdateStock } from ".";

const mockOnUpdate = vi.fn();

describe("UpdateStock tests", () => {
  it("should render the component", () => {
    const { getByRole } = render(<UpdateStock onUpdate={mockOnUpdate} />);

    expect(
      getByRole("button", { name: "Atualizar Estoque" })
    ).toBeInTheDocument();
  });

  it("should render error toasty", () => {
    const { getByRole, getByText } = render(
      <UpdateStock onUpdate={mockOnUpdate} />
    );

    const submitButton = getByRole("button", { name: "Atualizar Estoque" });
    fireEvent.click(submitButton);

    expect(getByText("Erro: Preencha todos os campos")).toBeInTheDocument();
  });

  it("should render call 'onUpdate'", () => {
    const { getByRole, getByPlaceholderText } = render(
      <UpdateStock onUpdate={mockOnUpdate} />
    );

    const nameInput = getByPlaceholderText("Produto");
    const deltaInput = getByPlaceholderText("+10 (entrada) ou -5 (saída)");

    fireEvent.change(nameInput, { target: { value: "Produto" } });
    fireEvent.change(deltaInput, { target: { value: "10" } });

    const submitButton = getByRole("button", { name: "Atualizar Estoque" });
    fireEvent.click(submitButton);

    expect(mockOnUpdate).toHaveBeenCalled();
  });
});
