import { describe, it, expect } from "vitest";
import {
  addProduct,
  addSoldProduct,
  fetchProducts,
  fetchProductsByPeriod,
  updateProductQuantity,
} from ".";
import { mockAddProductBody } from "@/lib/mocks/handlers";

describe("Service product tests", () => {
  it("should fetch products from stock", async () => {
    const products = await fetchProducts();

    expect(products.length).toBe(5);

    expect(products[0].name).toBe("Produto 1");
  });

  it("should return error when fetching products fails", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_STOCK } = await import("@/lib/appwrite");

    server.use(
      http.get(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_STOCK}/rows`,
        () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      )
    );

    await expect(fetchProducts()).rejects.toThrow();
  });

  it("should fetch products by period", async () => {
    const product = await fetchProductsByPeriod("Semanal");

    expect(product[0]).toHaveProperty("nome");
    expect(product[0].nome).toBe("Produto B");
  });

  it("should return error when fetching products by period fails", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_PRODUCTS } = await import(
      "@/lib/appwrite"
    );

    server.use(
      http.get(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUCTS}/rows`,
        () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      )
    );

    await expect(fetchProductsByPeriod("Semanal")).rejects.toThrow();
  });

  it("should add a product", async () => {
    const product = await addProduct(mockAddProductBody);

    expect(product).toHaveProperty("nome");
    expect(product.nome).toBe("Produto 6");
  });

  it("should return error when adding a product fails", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_STOCK } = await import("@/lib/appwrite");

    server.use(
      http.post(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_STOCK}/rows`,
        () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      )
    );

    await expect(addProduct(mockAddProductBody)).rejects.toThrow();
  });

  it("should update a product", async () => {
    const product = await updateProductQuantity({
      productName: "Product 1",
      newQuantity: 10,
    });

    expect(product).toHaveProperty("quantidade");
    expect(product.quantidade).toBe(10);
  });

  it("should return error when updating a product fails", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_STOCK } = await import("@/lib/appwrite");

    server.use(
      http.patch(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_STOCK}/rows/:rowId`,
        () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      )
    );

    await expect(
      updateProductQuantity({ productName: "Product 1", newQuantity: 10 })
    ).rejects.toThrow();
  });

  it("should throw error when product is not found during update", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_STOCK } = await import("@/lib/appwrite");

    server.use(
      http.get(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_STOCK}/rows`,
        () => {
          return HttpResponse.json({
            rows: [],
            total: 0,
          });
        }
      )
    );

    await expect(
      updateProductQuantity({
        productName: "Product Inexistente",
        newQuantity: 10,
      })
    ).rejects.toThrow("Product não encontrado.");
  });

  it("should add sold product", async () => {
    await expect(
      addSoldProduct({
        productName: "Product 1",
        quantity: 10,
        price: 10,
        period: "Semanal",
        goals: 10,
      })
    ).resolves.not.toThrow();
  });

  it("should throw error when add sold product fails", async () => {
    const { server } = await import("@/lib/mocks/server");
    const { http, HttpResponse } = await import("msw");
    const { DATABASE_ID, COLLECTION_ID_PRODUCTS } = await import(
      "@/lib/appwrite"
    );

    server.use(
      http.get(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUCTS}/rows`,
        () => {
          return HttpResponse.json({
            rows: [],
            total: 0,
          });
        }
      ),
      http.post(
        `https://nyc.cloud.appwrite.io/v1/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID_PRODUCTS}/rows`,
        () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      )
    );

    await expect(
      addSoldProduct({
        productName: "Product 1",
        quantity: 10,
        price: 10,
        period: "Semanal",
        goals: 10,
      })
    ).rejects.toThrow();
  });
});
