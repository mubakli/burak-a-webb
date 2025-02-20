import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to the environment variables.");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectDB;
// let client;
// let clientPromise;

// if (!global._mongoClientPromise) {
//   client = new MongoClient(uri, {
//     tls: true,
//     tlsInsecure: false,
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   });
//   global._mongoClientPromise = client.connect();
// }

// clientPromise = global._mongoClientPromise;

// export default clientPromise;

// const { MongoClient } = require("mongodb");

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
