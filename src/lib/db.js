const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://Bupropius:burak9300@vtradedb.oifqp.mongodb.net/?retryWrites=true&w=majority&appName=vtradedb";

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to Mangodb!");

    const db = client.db("vTradeDB");
    const users = db.collection("Users");

    const user = {
      username: "Burak A.",
      password: "12345",
      email: "burak@example.com",
    };
    const result = await users.insertOne(user);
    console.log(`User inserted with ID: ${result.insertId}`);

    const userFromDB = await users.find().toArray();
    console.log("All Users: ", userFromDB);
  } catch (error) {
    console.log("An error occured: ", error);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
