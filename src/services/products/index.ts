import { Query, type Models } from "appwrite";
import {
  COLLECTION_ID_STOCK,
  COLLECTION_ID_PRODUCTS,
  DATABASE_ID,
  id,
  tablesDB,
} from "@/lib/appwrite";

export type Product = Models.Row & {
  rowId: string;
  nome: string;
  quantidade: number;
  categoria: string;
};

export type ProductSale = Models.Row & {
  rowId: string;
  nome: string;
  quantidade: number;
  categoria: string;
  lucro: number;
  vendas: number;
};

export type ProductByPeriod = Models.Row & {
  nome: string;
  lucro: number;
  vendas: number;
  periodo: "Semanal" | "Mensal" | "Anual";
};

export async function fetchProducts() {
  try {
    const response = await tablesDB.listRows<Product>({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_STOCK,
    });

    return response.rows.map((doc) => ({
      id: doc.$id,
      name: doc.nome,
      quantity: doc.quantidade,
      type: doc.categoria,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos do estoque:", error);
    throw error;
  }
}

export const fetchProductsByPeriod = async (
  period: "Semanal" | "Mensal" | "Anual"
): Promise<ProductByPeriod[]> => {
  try {
    const response = await tablesDB.listRows<ProductByPeriod>({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_PRODUCTS,
      queries: [Query.equal("periodo", period)],
    });
    return response.rows;
  } catch (error) {
    console.error("Erro ao buscar produtos por periodo:", error);
    throw error;
  }
};

export const addProduct = async ({
  name,
  quantity,
  type,
}: {
  name: string;
  quantity: number;
  type: string;
}) => {
  try {
    const response = await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_STOCK,
      rowId: id.unique(),
      data: { nome: name, quantidade: quantity, categoria: type },
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar product:", error);
    throw error;
  }
};

export const updateProductQuantity = async ({
  productName,
  newQuantity,
}: {
  productName: string;
  newQuantity: number;
}) => {
  try {
    const response = await tablesDB.listRows<Product>({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_STOCK,
      queries: [Query.equal("nome", productName)],
    });

    const product = response.rows[0];

    if (!product) {
      throw new Error("Product não encontrado.");
    }

    const updateResponse = await tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_STOCK,
      rowId: product.$id,
      data: { quantidade: newQuantity },
    });

    return updateResponse;
  } catch (error) {
    console.error("Erro ao atualizar a quantidade do produto:", error);
    throw error;
  }
};

export async function addSoldProduct({
  productName,
  quantity,
  price,
  period,
  goals,
}: {
  productName: string;
  quantity: number;
  price: number;
  period: "Semanal" | "Mensal" | "Anual";
  goals: number;
}) {
  try {
    const { rows } = await tablesDB.listRows<ProductSale>({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID_PRODUCTS,
      queries: [
        Query.equal("nome", productName),
        Query.equal("periodo", period),
      ],
    });

    const lucro = quantity * price;

    if (rows.length === 0) {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID_PRODUCTS,
        rowId: id.unique(),
        data: {
          nome: productName,
          vendas: quantity,
          lucro,
          period,
          goals,
        },
      });
    } else {
      const product = rows[0];
      const novasVendas = (product.vendas ?? 0) + quantity;
      const novoLucro = (product.lucro ?? 0) + lucro;

      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID_PRODUCTS,
        rowId: product.$id,
        data: {
          vendas: novasVendas,
          lucro: novoLucro,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao adicionar produto vendido:", error);
    throw error;
  }
}
