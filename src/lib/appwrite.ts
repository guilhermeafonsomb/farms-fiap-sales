import { Account, Client, Databases, ID, TablesDB } from "appwrite";

export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const PRODUCTS_TABLE_ID = import.meta.env
  .VITE_APPWRITE_PRODUCTS_TABLE_ID;
export const STOCKS_TABLE_ID = import.meta.env.VITE_APPWRITE_STOCKS_TABLE_ID;

const client = new Client();

client.setEndpoint(APPWRITE_ENDPOINT).setProject("68d01da500316c3af9cd");

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
export const id = ID;
export default client;
