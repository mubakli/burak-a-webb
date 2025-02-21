// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const res = await fetch(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
//     );
//     const prices = await res.json();

//     return NextResponse.json(prices);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch prices" },
//       { status: 500 }
//     );
//   }
// }

// Fetch function
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function Trade() {
//   const { data, error } = useSWR<PriceData>("/api/prices", fetcher, {
//     refreshInterval: 300000, // Refresh every 5 munites
//   });

//   // UI Loading State
//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="animate-spin text-blue-500" size={32} />
//         <p className="ml-2 text-gray-700">Loading prices...</p>
//       </div>
//     );
//   }

//   // Handle API Errors
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         <p>Error fetching prices. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         📈 Live Market Prices (Updates Every 5m)
//       </h1>

//       <div className="space-y-4">
//         {/* Display Bitcoin */}
//         <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <TrendingUp className="text-green mr-2" size={24} />
//             <p className="font-semibold text-lg">Bitcoin</p>
//           </div>
//           <p className="text-xl font-bold">${data.bitcoin.usd.toFixed(2)}</p>
//         </div>

//         {/* Display Ethereum */}
//         <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <TrendingUp className="text-green-500 mr-2" size={24} />
//             <p className="font-semibold text-lg">Ethereum</p>
//           </div>
//           <p className="text-xl font-bold">${data.ethereum.usd.toFixed(2)}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
