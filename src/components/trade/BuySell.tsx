import { useCallback, useEffect, useState } from "react";
import { DollarSign, Wallet } from "lucide-react";

interface BuySellProps {
  crypto: string;
  price: number;
}

export default function BuySell({ crypto, price }: BuySellProps) {
  const [amountUSD, setAmountUSD] = useState<number | "">("");
  const [amountCrypto, setAmountCrypto] = useState<number | "">("");
  const [percentageUsed, setPercentageUsed] = useState<number>(0);
  const [selectedAction, setSelectedAction] = useState<"buy" | "sell">("buy");
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<
    { asset: string; quantity: number; averagePrice: number }[]
  >([]);

  const fetchUserData = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/portfolio/fetch?userId=${id}`);
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
          setPortfolio(data.portfolio);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [balance]
  );

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    }
  }, [fetchUserData]);

  const handleSelection = (action: "buy" | "sell") => {
    setSelectedAction(action);
  };

  const handleUSDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmountUSD(value);
      setAmountCrypto(value / price);
    } else {
      setAmountUSD("");
      setAmountCrypto("");
    }
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmountUSD(value * price);
      setAmountCrypto(value);
    } else {
      setAmountUSD("");
      setAmountCrypto("");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageUsed(Number(e.target.value));
    // Optional: Auto-fill amount based on percentage logic could go here
  };

  const handleTransaction = async () => {
    if (!userId) return alert("Please sign in to trade");

    let updatedBalance = balance;
    const updatedPortfolio = [...portfolio];

    if (selectedAction === "buy") {
      const cost = Number(amountUSD);
      if (cost > balance) {
        return alert("Insufficient USD balance");
      }
      updatedBalance -= cost;

      const assetIndex = updatedPortfolio.findIndex(
        (item) => item.asset === crypto
      );

      if (assetIndex !== -1) {
        updatedPortfolio[assetIndex].quantity += Number(amountCrypto);
        updatedPortfolio[assetIndex].averagePrice =
          (updatedPortfolio[assetIndex].averagePrice *
            updatedPortfolio[assetIndex].quantity +
            cost) /
          (updatedPortfolio[assetIndex].quantity + Number(amountCrypto));
      } else {
        updatedPortfolio.push({
          asset: crypto,
          quantity: Number(amountCrypto),
          averagePrice: price,
        });
      }
    } else {
      const sellAmount = Number(amountCrypto);
      const assetIndex = updatedPortfolio.findIndex(
        (item) => item.asset === crypto
      );

      if (
        assetIndex === -1 ||
        updatedPortfolio[assetIndex].quantity < sellAmount
      ) {
        return alert(`Insufficient ${crypto} balance`);
      }

      updatedBalance += Number(amountUSD);
      updatedPortfolio[assetIndex].quantity -= sellAmount;

      if (updatedPortfolio[assetIndex].quantity === 0) {
        updatedPortfolio.splice(assetIndex, 1);
      }
    }

    try {
      const response = await fetch("/api/portfolio/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          portfolio: updatedPortfolio,
          balance: updatedBalance,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBalance(updatedBalance);
        setPortfolio(updatedPortfolio);
        alert(data.message);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  const currentHeld = portfolio.find((p) => p.asset === crypto)?.quantity || 0;

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="bg-black/30 p-0.5 rounded-lg flex">
        <button
          onClick={() => handleSelection("buy")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            selectedAction === "buy"
              ? "bg-green-600/20 text-green-400 shadow-sm border border-green-500/30"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleSelection("sell")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            selectedAction === "sell"
              ? "bg-red-600/20 text-red-400 shadow-sm border border-red-500/30"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Info Row */}
      <div className="flex justify-between text-[10px] text-gray-500 font-mono tracking-tight px-1">
         <span>Bal: ${balance.toLocaleString()}</span>
         <span>Hold: {currentHeld.toFixed(4)}</span>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <DollarSign size={12} className="text-gray-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
             type="number"
             placeholder="USD Amount"
             className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
             value={amountUSD}
             onChange={handleUSDChange}
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Wallet size={12} className="text-gray-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
             type="number"
             placeholder={`${crypto.toUpperCase()} Amount`}
             className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
             value={amountCrypto}
             onChange={handleCryptoChange}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1 pt-1">
         <input
            type="range"
            min="0"
            max="100"
            value={percentageUsed}
            onChange={handleSliderChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-125"
         />
         <div className="text-center text-[10px] text-gray-500">
            {percentageUsed}% used
         </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTransaction}
        className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all transform active:scale-95 ${
          selectedAction === "buy"
            ? "bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-900/20"
            : "bg-red-500 hover:bg-red-400 text-black shadow-lg shadow-red-900/20"
        }`}
      >
        {selectedAction} {crypto.toUpperCase()}
      </button>
    </div>
  );
}
