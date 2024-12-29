import { connect } from "http2";
import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://Bupropius:burak9300@vtradedb.oifqp.mongodb.net/?retryWrites=true&w=majority&appName=vtradedb";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MangoDB!");

    const db = client.db("vTradesDB");
    const users = db.collection("Users");

    const user = {
      username: "Burak A.",
      password: "12345",
      email: "burak@example.com",
    };

    const result = await users.insertOne(user);
    // Query for a movie that has the title 'Back to the Future'

    console.log(`User inserted with ID: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
