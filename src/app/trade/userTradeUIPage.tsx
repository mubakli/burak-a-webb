"use client";

import { useEffect, useState } from "react";
import { Loader, TrendingUp } from "lucide-react";
import BuySell from "./BuySell";

interface CryptoPrice {
  usd: number;
}

interface PriceData {
  [key: string]: CryptoPrice;
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
        Live Market Prices (Updates Every 5m)
      </h1>

      <div className="space-y-6">
        {/* All API Data Cards List */}
        {Object.entries(data).map(([crypto, { usd }]) => (
          <div key={crypto}>
            <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="text-yellow-500 mr-2" size={24} />
                  <p className="font-semibold text-lg capitalize">{crypto}</p>
                </div>
                <p className="text-xl font-bold">${usd}</p>
              </div>

              <BuySell crypto={crypto} price={usd} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
