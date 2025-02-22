import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,render-token&vs_currencies=usd"
    );
    const prices = await res.json();

    return NextResponse.json(prices);
  } catch (error) {
    console.log("Error fetching prices: ", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
