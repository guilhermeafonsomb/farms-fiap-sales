export type Product = {
  id?: string;
  name: string;
  quantity: number;
  type: string;
};

export type ProductByPeriod = {
  name: string;
  period: "WEEKLY" | "MONTHLY" | "ANNUAL";
  sales: number;
  profit: number;
};
