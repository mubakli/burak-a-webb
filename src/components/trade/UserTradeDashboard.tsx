import { useEffect, useState } from "react";
import { Loader, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";
import BuySell from "./BuySell";
import { marketService, PriceData } from "@/services/marketService";

export default function UserTradeDashboard({ isPreview = false }: { isPreview?: boolean }) {
  const [data, setData] = useState<PriceData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const prices = await marketService.fetchCryptoPrices();
        setData(prices);
      } catch (err) {
        console.log("An error occured fetching prices with API ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-red-500/20 text-red-400">
        <p className="text-lg font-medium">Unable to load market data</p>
        <p className="text-sm opacity-70 mt-2">Please check your connection or try again later.</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader className="animate-spin text-purple-500 mb-4" size={40} />
        <p className="text-gray-400 font-medium">Syncing with global markets...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-blue-400" />
            Live Market
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time cryptocurrency prices updated every 5 minutes.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
           <RefreshCw size={12} className="animate-spin-slow" />
           <span>Auto-refresh active</span>
        </div>
      </div>

      <div className={`grid gap-4 ${
        isPreview 
          ? "grid-cols-1 sm:grid-cols-2" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}>
        {Object.entries(data).map(([crypto, { usd }]) => (
          <div key={crypto} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-lg group">
             {/* Card Header */}
             <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-white/10 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-colors">
                      <TrendingUp className="text-indigo-400" size={16} />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-base capitalize tracking-tight leading-none">{crypto}</h3>
                       <p className="text-[10px] text-gray-500 font-mono mt-0.5">USD Pair</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-white tracking-tight bg-white/5 px-2 py-1 rounded-md border border-white/5">${usd.toLocaleString()}</p>
                 </div>
               </div>
             </div>

             {/* Action Area */}
             <div className="p-4">
                <BuySell crypto={crypto} price={usd} />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
