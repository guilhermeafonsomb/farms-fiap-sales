import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@/test/test-utils";
import { Sales } from ".";
import * as useProductsHook from "@/hooks/useProducts";
import * as useAddProductHook from "@/hooks/useAddProducts";
import * as produtosService from "@/services/products";
import { QueryClient } from "@tanstack/react-query";

vi.mock("@/hooks/useProducts");
vi.mock("@/hooks/useAddProducts");
vi.mock("@/services/products");
vi.mock("react-toastify", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-toastify")>();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("Sales Page Integration Tests", () => {
  const mockProducts = [
    { id: "1", name: "Produto A", quantity: 100, type: "Tipo 1" },
    { id: "2", name: "Produto B", quantity: 50, type: "Tipo 2" },
  ];

  const mockMutate = vi.fn();
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useProductsHook, "useProducts").mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useAddProductHook, "useAddProduct").mockReturnValue({
      mutate: mockMutate,
    } as any);

    vi.spyOn(QueryClient.prototype, "invalidateQueries").mockImplementation(
      mockQueryClient.invalidateQueries as any
    );
  });

  describe("Rendering", () => {
    it("should render page title", () => {
      const { getByText } = render(<Sales />);
      expect(getByText("Estoque e Vendas")).toBeInTheDocument();
    });

    it("should render all sections", () => {
      const { getByText, getAllByText } = render(<Sales />);
      expect(getByText("Adicionar Produto")).toBeInTheDocument();
      expect(getAllByText("Atualizar Estoque")[0]).toBeInTheDocument();
      expect(getAllByText("Registrar Venda")[0]).toBeInTheDocument();
      expect(getByText("Produtos em Estoque")).toBeInTheDocument();
    });

    it("should display products list", () => {
      const { getByText } = render(<Sales />);
      expect(getByText("Produto A")).toBeInTheDocument();
      expect(getByText("Produto B")).toBeInTheDocument();
      expect(getByText("Quantidade: 100")).toBeInTheDocument();
      expect(getByText("Quantidade: 50")).toBeInTheDocument();
    });

    it("should render empty list when no products", () => {
      vi.spyOn(useProductsHook, "useProducts").mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      const { queryByText } = render(<Sales />);
      expect(queryByText("Produto A")).not.toBeInTheDocument();
    });
  });

  describe("Add Product Integration", () => {
    it("should add product successfully", async () => {
      const { toast } = await import("react-toastify");
      const { getByPlaceholderText, getByText } = render(<Sales />);

      const nameInput = getByPlaceholderText("Nome do Produto");
      const quantityInput = getByPlaceholderText("Quantidade");
      const typeInput = getByPlaceholderText("Tipo");

      fireEvent.change(nameInput, { target: { value: "Novo Produto" } });
      fireEvent.change(quantityInput, { target: { value: "20" } });
      fireEvent.change(typeInput, { target: { value: "Tipo 3" } });

      const addButton = getByText("Adicionar Produto");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          name: "Novo Produto",
          quantity: 20,
          type: "Tipo 3",
        });
        expect(toast.success).toHaveBeenCalledWith("Produto adicionado!");
      });
    });

    it("should show error when add product fails", async () => {
      const { toast } = await import("react-toastify");
      mockMutate.mockImplementation(() => {
        throw new Error("Failed");
      });

      const { getByPlaceholderText, getByText } = render(<Sales />);

      const nameInput = getByPlaceholderText("Nome do Produto");
      const quantityInput = getByPlaceholderText("Quantidade");
      const typeInput = getByPlaceholderText("Tipo");

      fireEvent.change(nameInput, { target: { value: "Produto" } });
      fireEvent.change(quantityInput, { target: { value: "10" } });
      fireEvent.change(typeInput, { target: { value: "Tipo" } });

      const addButton = getByText("Adicionar Produto");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Não foi possível adicionar o produto."
        );
      });
    });
  });

  describe("Update Stock Integration", () => {
    it("should update stock successfully", async () => {
      const { toast } = await import("react-toastify");
      vi.spyOn(produtosService, "updateProductQuantity").mockResolvedValue(
        {} as any
      );

      const { getAllByPlaceholderText, getAllByText } = render(<Sales />);

      const productInput = getAllByPlaceholderText("Produto")[0];
      const deltaInput = getAllByPlaceholderText(
        "+10 (entrada) ou -5 (saída)"
      )[0];

      fireEvent.change(productInput, { target: { value: "Produto A" } });
      fireEvent.change(deltaInput, { target: { value: "10" } });

      const updateButton = getAllByText("Atualizar Estoque")[1];
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(produtosService.updateProductQuantity).toHaveBeenCalledWith({
          productName: "Produto A",
          newQuantity: 110,
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
          queryKey: ["produtos"],
        });
        expect(toast.success).toHaveBeenCalledWith("Estoque atualizado!");
      });
    });

    it("should show error when product not found", async () => {
      const { toast } = await import("react-toastify");
      const { getAllByPlaceholderText, getAllByText } = render(<Sales />);

      const productInput = getAllByPlaceholderText("Produto")[0];
      const deltaInput = getAllByPlaceholderText(
        "+10 (entrada) ou -5 (saída)"
      )[0];

      fireEvent.change(productInput, { target: { value: "Inexistente" } });
      fireEvent.change(deltaInput, { target: { value: "10" } });

      const updateButton = getAllByText("Atualizar Estoque")[1];
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Produto não encontrado.");
      });
    });

    it("should show error when update fails", async () => {
      const { toast } = await import("react-toastify");
      vi.spyOn(produtosService, "updateProductQuantity").mockRejectedValue(
        new Error("Failed")
      );

      const { getAllByPlaceholderText, getAllByText } = render(<Sales />);

      const productInput = getAllByPlaceholderText("Produto")[0];
      const deltaInput = getAllByPlaceholderText(
        "+10 (entrada) ou -5 (saída)"
      )[0];

      fireEvent.change(productInput, { target: { value: "Produto A" } });
      fireEvent.change(deltaInput, { target: { value: "5" } });

      const updateButton = getAllByText("Atualizar Estoque")[1];
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Não foi possível atualizar o estoque."
        );
      });
    });
  });

  describe("Register Sale Integration", () => {
    it("should register sale successfully", async () => {
      const { toast } = await import("react-toastify");
      vi.spyOn(produtosService, "addSoldProduct").mockResolvedValue(
        undefined as any
      );
      vi.spyOn(produtosService, "updateProductQuantity").mockResolvedValue(
        {} as any
      );

      const { getAllByPlaceholderText, getAllByText, getByTestId } = render(
        <Sales />
      );

      const productInput = getAllByPlaceholderText("Produto")[1];
      const quantityInput = getAllByPlaceholderText("Quantidade Vendida")[0];
      const priceInput = getAllByPlaceholderText("Preço")[0];
      const periodSelect = getByTestId("period-select");
      const goalsInput = getAllByPlaceholderText("Meta")[0];

      fireEvent.change(productInput, { target: { value: "Produto A" } });
      fireEvent.change(quantityInput, { target: { value: "5" } });
      fireEvent.change(priceInput, { target: { value: "100" } });
      fireEvent.change(periodSelect, { target: { value: "Mensal" } });
      fireEvent.change(goalsInput, { target: { value: "1000" } });

      const registerButton = getAllByText("Registrar Venda")[1];
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(produtosService.addSoldProduct).toHaveBeenCalledWith({
          productName: "Produto A",
          quantity: 5,
          price: 100,
          period: "Mensal",
          goals: 1000,
        });
        expect(produtosService.updateProductQuantity).toHaveBeenCalledWith({
          productName: "Produto A",
          newQuantity: 95,
        });
        expect(toast.success).toHaveBeenCalledWith("Venda registrada!");
      });
    });

    it("should show error when register sale fails", async () => {
      const { toast } = await import("react-toastify");
      vi.spyOn(produtosService, "addSoldProduct").mockRejectedValue(
        new Error("Failed")
      );

      const { getAllByPlaceholderText, getAllByText, getByTestId } = render(
        <Sales />
      );

      const productInput = getAllByPlaceholderText("Produto")[1];
      const quantityInput = getAllByPlaceholderText("Quantidade Vendida")[0];
      const priceInput = getAllByPlaceholderText("Preço")[0];
      const periodSelect = getByTestId("period-select");
      const goalsInput = getAllByPlaceholderText("Meta")[0];

      fireEvent.change(productInput, { target: { value: "Produto A" } });
      fireEvent.change(quantityInput, { target: { value: "5" } });
      fireEvent.change(priceInput, { target: { value: "100" } });
      fireEvent.change(periodSelect, { target: { value: "Semanal" } });
      fireEvent.change(goalsInput, { target: { value: "500" } });

      const registerButton = getAllByText("Registrar Venda")[1];
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Não foi possível registrar a venda."
        );
      });
    });
  });
});
