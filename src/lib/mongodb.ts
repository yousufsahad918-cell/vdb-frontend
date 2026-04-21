import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = "vibdb";

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL environment variable not set");
  }
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(MONGO_URL);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
  const client = new MongoClient(MONGO_URL);
  return client.connect();
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}
