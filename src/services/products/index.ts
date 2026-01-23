import { Query } from "appwrite";
import {
  STOCKS_TABLE_ID,
  PRODUCTS_TABLE_ID,
  DATABASE_ID,
  id,
  tablesDB,
} from "@/lib/appwrite";
import type { Product, ProductByPeriod } from "@/model/products";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: STOCKS_TABLE_ID,
    });

    return response.rows as unknown as Product[];
  } catch (error) {
    console.error("Erro ao buscar produtos do estoque:", error);
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
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: STOCKS_TABLE_ID,
      queries: [Query.equal("name", productName)],
    });

    const product = response.rows[0];

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    const updateResponse = await tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: STOCKS_TABLE_ID,
      rowId: product.$id,
      data: { quantidade: newQuantity },
    });

    return updateResponse;
  } catch (error) {
    console.error("Erro ao atualizar a quantidade do produto:", error);
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
      tableId: STOCKS_TABLE_ID,
      rowId: id.unique(),
      data: { nome: name, quantidade: quantity, categoria: type },
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar product:", error);
    throw error;
  }
};

export const fetchProductsByPeriod = async (
  period: "WEEKLY" | "MONTHLY" | "ANNUAL",
): Promise<ProductByPeriod[]> => {
  try {
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: PRODUCTS_TABLE_ID,
      queries: [Query.equal("periodo", period)],
    });

    return response.rows as unknown as ProductByPeriod[];
  } catch (error) {
    console.error("Erro ao buscar produtos por periodo:", error);
    throw error;
  }
};

export const addSoldProduct = async ({
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
}) => {
  try {
    const { rows } = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: PRODUCTS_TABLE_ID,
      queries: [
        Query.equal("name", productName),
        Query.equal("period", period),
      ],
    });

    const profit = quantity * price;

    if (rows.length === 0) {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: PRODUCTS_TABLE_ID,
        rowId: id.unique(),
        data: {
          name: productName,
          sales: quantity,
          profit,
          period,
          goals,
        },
      });
    } else {
      const product = rows[0];
      const newSales = (product.sales ?? 0) + quantity;
      const newProfit = (product.profit ?? 0) + profit;

      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: PRODUCTS_TABLE_ID,
        rowId: product.$id,
        data: {
          sales: newSales,
          profit: newProfit,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao adicionar produto vendido:", error);
    throw error;
  }
};
