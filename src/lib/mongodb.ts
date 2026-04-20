import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL!;
const DB_NAME = "vibdb";

if (!MONGO_URL) throw new Error("MONGO_URL environment variable not set");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URL);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URL);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export default clientPromise;
