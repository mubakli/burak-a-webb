import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db"; // Import the connection function
import Admin from "../../../../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectDB(); // Ensure DB is connected before queries

  try {
    const { email, password } = await request.json();

    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!admin.isAdmin) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
