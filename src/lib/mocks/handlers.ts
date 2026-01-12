import { http, HttpResponse } from "msw";
import {
  DATABASE_ID,
  COLLECTION_ID_PRODUTOS,
  COLLECTION_ID_ESTOQUE,
} from "../appwrite";

const mockStockProducts = [
  {
    $id: "1",
    nome: "Produto 1",
    quantidade: 100,
    categoria: "Tipo A",
  },
  {
    $id: "2",
    nome: "Produto 2",
    quantidade: 50,
    categoria: "Tipo B",
  },
  {
    $id: "3",
    nome: "Produto 3",
    quantidade: 75,
    categoria: "Tipo A",
  },
  {
    $id: "4",
    nome: "Produto 4",
    quantidade: 30,
    categoria: "Tipo C",
  },
  {
    $id: "5",
    nome: "Produto 5",
    quantidade: 120,
    categoria: "Tipo B",
  },
];

const mockProductsByPeriod = [
  {
    $id: "p2",
    nome: "Produto B",
    lucro: 2000,
    vendas: 100,
    periodo: "Semanal",
  },
  {
    $id: "p3",
    nome: "Produto C",
    lucro: 5000,
    vendas: 200,
    periodo: "Mensal",
  },
  {
    $id: "p4",
    nome: "Produto D",
    lucro: 10000,
    vendas: 500,
    periodo: "Anual",
  },
];

export const mockAddProductBody = {
  name: "Produto 6",
  quantity: 150,
  type: "Tipo D",
};

interface QueryParam {
  attribute: string;
  values: string[];
}

export const handlers = [
  http.get(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_ESTOQUE}/rows`,
    ({ request }) => {
      const url = new URL(request.url);
      const queries = url.searchParams.get("queries");

      if (queries?.includes("nome")) {
        const parsedQueries = JSON.parse(queries) as QueryParam[];
        const productName = parsedQueries[0].values[0];
        const product = mockStockProducts.find((p) => p.nome === productName);

        return HttpResponse.json({
          rows: product ? [product] : [],
          total: product ? 1 : 0,
        });
      }

      return HttpResponse.json({
        rows: mockStockProducts,
        total: mockStockProducts.length,
      });
    }
  ),

  http.get(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUTOS}/rows`,
    ({ request }) => {
      const url = new URL(request.url);
      const queries = url.searchParams.get("queries");

      if (queries) {
        const parsedQueries = JSON.parse(queries) as QueryParam[];
        const periodQuery = parsedQueries.find(
          (q) => q.attribute === "periodo"
        );

        if (periodQuery) {
          const period = periodQuery.values[0];
          const filtered = mockProductsByPeriod.filter(
            (p) => p.periodo === period
          );

          return HttpResponse.json({
            rows: filtered,
            total: filtered.length,
          });
        }
      }

      return HttpResponse.json({
        rows: mockProductsByPeriod,
        total: mockProductsByPeriod.length,
      });
    }
  ),

  http.post(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_ESTOQUE}/rows`,
    async ({ request }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };

      return HttpResponse.json({
        $id: "new-product-id",
        ...body.data,
      });
    }
  ),

  http.patch(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_ESTOQUE}/rows/:rowId`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };
      const { rowId } = params;

      return HttpResponse.json({
        $id: rowId,
        ...body.data,
      });
    }
  ),

  http.post(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUTOS}/rows`,
    async ({ request }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };

      return HttpResponse.json({
        $id: "new-sale-id",
        ...body.data,
      });
    }
  ),

  http.patch(
    `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUTOS}/rows/:rowId`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };
      const { rowId } = params;

      return HttpResponse.json({
        $id: rowId,
        ...body.data,
      });
    }
  ),
];
