import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), {
        status: 400,
      });
    }

    const user = await User.findbyId(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ portfolio: user.portfolio }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: " Internal server error/",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
