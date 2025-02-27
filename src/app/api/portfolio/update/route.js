import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, portfolio, balance } = await req.json();

    if (!userId || !portfolio || balance === undefined) {
      return new Response(
        JSON.stringify({
          message: " User ID, portfolio, and balance are required.",
        }),
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: " User not found/" }), {
        status: 404,
      });
    }

    user.portfolio = portfolio;
    user.balance = balance;
    await user.save();

    return new Response(
      JSON.stringify({ message: " Portfolio updated successfully !  " }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: " Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
