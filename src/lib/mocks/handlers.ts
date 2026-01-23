import { http, HttpResponse } from "msw";
import {
  APPWRITE_ENDPOINT,
  PRODUCTS_TABLE_ID,
  STOCKS_TABLE_ID,
  DATABASE_ID,
} from "../appwrite";

const mockStockProducts = [
  {
    $id: "1",
    name: "Produto 1",
    quantity: 100,
    type: "Tipo A",
  },
  {
    $id: "2",
    name: "Produto 2",
    quantity: 50,
    type: "Tipo B",
  },
  {
    $id: "3",
    name: "Produto 3",
    quantity: 75,
    type: "Tipo A",
  },
  {
    $id: "4",
    name: "Produto 4",
    quantity: 30,
    type: "Tipo C",
  },
  {
    $id: "5",
    name: "Produto 5",
    quantity: 120,
    type: "Tipo B",
  },
];

const mockProductsByPeriod = [
  {
    $id: "p2",
    name: "Produto B",
    profit: 2000,
    sales: 100,
    period: "WEEKLY",
  },
  {
    $id: "p3",
    name: "Produto C",
    profit: 5000,
    sales: 200,
    period: "MONTHLY",
  },
  {
    $id: "p4",
    name: "Produto D",
    profit: 10000,
    sales: 500,
    period: "ANNUAL",
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
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${STOCKS_TABLE_ID}/rows`,
    ({ request }) => {
      const url = new URL(request.url);
      const queries = url.searchParams.get("queries");

      if (queries?.includes("name")) {
        const parsedQueries = JSON.parse(queries) as QueryParam[];
        const productName = parsedQueries[0].values[0];
        const product = mockStockProducts.find((p) => p.name === productName);

        return HttpResponse.json({
          rows: product ? [product] : [],
          total: product ? 1 : 0,
        });
      }

      return HttpResponse.json({
        rows: mockStockProducts,
        total: mockStockProducts.length,
      });
    },
  ),

  http.get(
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${PRODUCTS_TABLE_ID}/rows`,
    ({ request }) => {
      const url = new URL(request.url);
      const queries = url.searchParams.get("queries");

      if (queries) {
        const parsedQueries = JSON.parse(queries) as QueryParam[];
        const periodQuery = parsedQueries.find((q) => q.attribute === "period");

        if (periodQuery) {
          const period = periodQuery.values[0];
          const filtered = mockProductsByPeriod.filter(
            (p) => p.period === period,
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
    },
  ),

  http.post(
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${STOCKS_TABLE_ID}/rows`,
    async ({ request }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };

      return HttpResponse.json({
        $id: "new-product-id",
        ...body.data,
      });
    },
  ),

  http.patch(
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${STOCKS_TABLE_ID}/rows/:rowId`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };
      const { rowId } = params;

      return HttpResponse.json({
        $id: rowId,
        ...body.data,
      });
    },
  ),

  http.post(
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${PRODUCTS_TABLE_ID}/rows`,
    async ({ request }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };

      return HttpResponse.json({
        $id: "new-sale-id",
        ...body.data,
      });
    },
  ),

  http.patch(
    `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${PRODUCTS_TABLE_ID}/rows/:rowId`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        data: Record<string, unknown>;
      };
      const { rowId } = params;

      return HttpResponse.json({
        $id: rowId,
        ...body.data,
      });
    },
  ),
];
