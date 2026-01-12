import { Account, Client, Databases, ID, TablesDB } from "appwrite";

export const DATABASE_ID = "68d021ad002fe84e49fb";
export const COLLECTION_ID_PRODUTOS = "produtos";
export const COLLECTION_ID_ESTOQUE = "estoque";

const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("68d01da500316c3af9cd");

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
export const id = ID;
export default client;
