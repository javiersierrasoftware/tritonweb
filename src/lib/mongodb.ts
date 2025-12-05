import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tritonweb";

if (!uri) {
  throw new Error("⚠️ Debes definir MONGODB_URI en las variables de entorno");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

declare global {
  // Para evitar problemas de recarga en dev
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}