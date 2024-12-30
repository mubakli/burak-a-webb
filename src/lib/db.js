import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to the environment variables.");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    tls: true,
    tlsInsecure: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;

// const { MongoClient } = require("mongodb");

// const uri =
//   "mongodb+srv://Bupropius:burak9300@vtradedb.oifqp.mongodb.net/?retryWrites=true&w=majority&appName=vtradedb";

// async function main() {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     console.log("Connected to Mangodb!");

//     const db = client.db("vTradeDB");
//     const users = db.collection("Users");

//     const user = {
//       username: "Burak A.",
//       password: "12345",
//       email: "burak@example.com",
//     };
//     const result = await users.insertOne(user);
//     console.log(`User inserted with ID: ${result.insertId}`);

//     const userFromDB = await users.find().toArray();
//     console.log("All Users: ", userFromDB);
//   } catch (error) {
//     console.log("An error occured: ", error);
//   } finally {
//     await client.close();
//   }
// }
// main().catch(console.error);
