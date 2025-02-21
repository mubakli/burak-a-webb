"use client";

import { useEffect, useState } from "react";
import { Loader, TrendingUp } from "lucide-react";

interface PriceData {
  bitcoin: { usd: number };
  ethereum: { usd: number };
}

export default function Trade() {
  const [data, setData] = useState<PriceData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const prices = await res.json();
        setData(prices);
      } catch (err) {
        console.log("An error occured fetching prices with API ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (type: "buy" | "sell", coin: string) => {
    alert(`${type.toUpperCase()} ${coin} clicked!`);
    // TODO: Connect this to an API for actual trading logic
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error fetching prices. Please try again later.</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={32} />
        <p className="ml-2 text-gray-400">Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        📈 Live Market Prices (Updates Every 5m)
      </h1>

      <div className="space-y-6">
        {/* Bitcoin Card */}
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-yellow-500 mr-2" size={24} />
              <p className="font-semibold text-lg">Bitcoin (BTC)</p>
            </div>
            <p className="text-xl font-bold">${data.bitcoin.usd.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleTrade("buy", "Bitcoin")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade("sell", "Bitcoin")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
            >
              Sell
            </button>
          </div>
        </div>

        {/* Ethereum Card */}
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-blue-500 mr-2" size={24} />
              <p className="font-semibold text-lg">Ethereum (ETH)</p>
            </div>
            <p className="text-xl font-bold">${data.ethereum.usd.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleTrade("buy", "Ethereum")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade("sell", "Ethereum")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
