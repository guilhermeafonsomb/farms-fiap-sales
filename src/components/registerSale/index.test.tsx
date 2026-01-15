import { render, fireEvent } from "@/test/test-utils";
import { RegisterSale } from "./index";
import { vi } from "vitest";

describe("RegisterSale", () => {
  const mockOnRegister = vi.fn();

  beforeEach(() => {
    mockOnRegister.mockClear();
  });

  it("should render all form fields", () => {
    const { getByLabelText, getByTestId } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    expect(getByLabelText(/produto/i)).toBeInTheDocument();
    expect(getByLabelText(/quantidade vendida/i)).toBeInTheDocument();
    expect(getByLabelText(/preço/i)).toBeInTheDocument();
    expect(getByLabelText(/meta/i)).toBeInTheDocument();
    expect(getByTestId("period-select")).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty form", () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    const submitButton = getByRole("button", {
      name: /registrar venda/i,
    });
    fireEvent.click(submitButton);

    expect(mockOnRegister).not.toHaveBeenCalled();

    const alerts = getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);

    expect(
      getAllByText("O campo Produto é obrigatório")[1]
    ).toBeInTheDocument();
    expect(
      getAllByText("O campo Quantidade é obrigatório")[1]
    ).toBeInTheDocument();
    expect(getAllByText("O campo Preço é obrigatório")[1]).toBeInTheDocument();
    expect(getAllByText("O campo Meta é obrigatório")[1]).toBeInTheDocument();
  });

  it("should link errors to inputs using aria-describedby", () => {
    const { getByRole, getByLabelText } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    const submitButton = getByRole("button", {
      name: /registrar venda/i,
    });
    fireEvent.click(submitButton);

    const productInput = getByLabelText(/produto/i);
    expect(productInput).toHaveAttribute("aria-invalid", "true");
    expect(productInput).toHaveAttribute(
      "aria-describedby",
      "product-name-error"
    );

    const errorMsg = document.getElementById("product-name-error");
    expect(errorMsg).toHaveTextContent("O campo Produto é obrigatório");
    expect(errorMsg).toHaveAttribute("id", "product-name-error");
  });

  it("should focus error summary when validation fails", () => {
    const { getByRole } = render(<RegisterSale onRegister={mockOnRegister} />);

    const submitButton = getByRole("button", {
      name: /registrar venda/i,
    });
    fireEvent.click(submitButton);

    const errorSummaryHeading = getByRole("heading", {
      name: /encontramos 4 erros no formulário/i,
    });
    expect(errorSummaryHeading).toBeInTheDocument();
    expect(document.activeElement).toBe(errorSummaryHeading);
  });

  it("should clear errors and submit when form is valid", () => {
    const { getByLabelText, getByRole, queryByText } = render(
      <RegisterSale onRegister={mockOnRegister} />
    );

    fireEvent.change(getByLabelText(/produto/i), {
      target: { value: "Tomate" },
    });
    fireEvent.change(getByLabelText(/quantidade vendida/i), {
      target: { value: "100" },
    });
    fireEvent.change(getByLabelText(/preço/i), {
      target: { value: "5" },
    });
    fireEvent.change(getByLabelText(/meta/i), {
      target: { value: "1000" },
    });

    const submitButton = getByRole("button", {
      name: /registrar venda/i,
    });
    fireEvent.click(submitButton);

    expect(mockOnRegister).toHaveBeenCalledWith({
      product: "Tomate",
      quantity: 100,
      price: 5,
      period: "Semanal",
      goals: 1000,
    });

    expect(
      queryByText("O campo Produto é obrigatório")
    ).not.toBeInTheDocument();
  });
});
