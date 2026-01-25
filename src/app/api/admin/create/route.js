import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../../../models/Admin.js";
import connectDB from "../../../../lib/db.js";

export async function POST(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const exist = await Admin.findOne({ email });
    if (exist) {
      return new Response(
        JSON.stringify({ message: "The admin already exists. " }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
      isAdmin: true,
    });
    await admin.save();

    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET
    );
    console.log("JWT_SECRET", process.env.JWT_SECRET);
    console.log("token", token);

    return new Response(
      JSON.stringify({ message: "Admin created successfully", token }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
