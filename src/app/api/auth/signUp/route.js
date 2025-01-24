import clientPromise from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Extract email and password from the request body
    const { username, email, password } = await req.json();

    // Validate input data
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({
          message: "Email, password and username are required.",
        }),
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    const client = await clientPromise; // Resolving the MongoDB connection promise
    const db = client.db("vTradeDB"); // Default database as per MongoDB URI
    const collection = db.collection("Users");

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), {
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await collection.insertOne({
      username,
      email,
      password: hashedPassword,
    });

    // Return success response
    return new Response(
      JSON.stringify({
        message: `User created successfully! User ID: ${result.insertedId}`,
      }),
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
