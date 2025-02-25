import connectDB from "../../../../lib/db";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();
    // // Extract email and password from the request body
    const { username, email, password } = await req.json();

    if (username) {
      if (!email || !password) {
        return new Response(
          JSON.stringify({
            message: `${username}, ,${email} , ${password} Email, password and username are required.`,
          }),
          { status: 400 }
        );
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({
            message: "User already exists.",
          }),
          {
            status: 400,
          }
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        balance: 1000000, //default virtual balance
        portfolio: [],
      });

      await newUser.save();

      // Return success response
      return new Response(
        JSON.stringify({
          message: `User created successfully! User ID: ${newUser.insertedId}`,
          userId: newUser._id.toString(),
        }),
        { status: 201 }
      );
    }
    //if username is NULL
    else {
      if (!email || !password) {
        return new Response(
          JSON.stringify({
            message: "Email and password are required.",
          }),
          { status: 400 }
        );
      }

      const user = await User.findOne({ email });
      if (!user) {
        return new Response(
          JSON.stringify({
            message: "Invalid email or password.",
          }),
          { status: 400 }
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return new Response(
          JSON.stringify({
            message: "Invalid email or password.",
          }),
          { status: 400 }
        );
      }
      return new Response(
        JSON.stringify({
          message: "you have signed in successfully!",
          userId: user._id.toString(),
        }),
        { status: 200 }
      );
    }
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
