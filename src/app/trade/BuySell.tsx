import { useCallback, useEffect, useState } from "react";

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
          console.log(balance);
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
  };

  const handleTransaction = async () => {
    if (!userId) return alert("User not found");

    let updatedBalance = balance;
    const updatedPortfolio = [...portfolio]; // Convert to array

    if (selectedAction === "buy") {
      const cost = Number(amountUSD);
      if (cost > balance) {
        return alert("Not enough USD balance");
      }
      updatedBalance -= cost;

      // Check if the asset already exists in the portfolio
      const assetIndex = updatedPortfolio.findIndex(
        (item) => item.asset === crypto
      );

      if (assetIndex !== -1) {
        // Asset exists, update quantity and recalculate average price
        updatedPortfolio[assetIndex].quantity += Number(amountCrypto);
        updatedPortfolio[assetIndex].averagePrice =
          (updatedPortfolio[assetIndex].averagePrice *
            updatedPortfolio[assetIndex].quantity +
            cost) /
          (updatedPortfolio[assetIndex].quantity + Number(amountCrypto));
      } else {
        // New asset, add to portfolio
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
        return alert("Not enough crypto balance");
      }

      updatedBalance += Number(amountUSD);
      updatedPortfolio[assetIndex].quantity -= sellAmount;

      if (updatedPortfolio[assetIndex].quantity === 0) {
        // Remove asset if quantity is 0
        updatedPortfolio.splice(assetIndex, 1);
      }
    }

    // Send updated data to API
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

  // const handleTransaction = async () => {
  //   if (!userId) return alert("User not found");

  //   let updatedBalance = balance;
  //   let updatedPortfolio = { ...portfolio };

  //   if (selectedAction === "buy") {
  //     const cost = Number(amountUSD);
  //     if (cost > balance) {
  //       return alert("Not enough USD balance");
  //     }
  //     updatedBalance -= cost;
  //     updatedPortfolio[crypto] =
  //       (updatedPortfolio[crypto] || 0) + Number(amountCrypto);
  //   } else {
  //     const sellAmount = Number(amountCrypto);
  //     if ((updatedPortfolio[crypto] || 0) < sellAmount) {
  //       return alert("Not enough crypto balance");
  //     }
  //     updatedBalance += Number(amountUSD);
  //     updatedPortfolio[crypto] -= sellAmount;
  //   }

  //   // Send updated portfolio and balance to API
  //   try {
  //     const response = await fetch("/api/portfolio/update", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId,
  //         portfolio: updatedPortfolio,
  //         balance: updatedBalance,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setBalance(updatedBalance);
  //       setPortfolio(updatedPortfolio);
  //       alert(data.message);
  //     } else {
  //       console.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating portfolio:", error);
  //   }
  // };

  return (
    <div>
      {/* Buy/Sell Toggle */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => handleSelection("buy")}
          className={`px-4 py-2 rounded-lg transition-all font-semibold ${
            selectedAction === "buy"
              ? "bg-green-600 text-white scale-105 shadow-md"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleSelection("sell")}
          className={`px-4 py-2 rounded-lg transition-all font-semibold ${
            selectedAction === "sell"
              ? "bg-red-600 text-white scale-105 shadow-md"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg text-white">
        <h2 className="text-lg font-bold mb-4">
          Trade {crypto.charAt(0).toLocaleUpperCase() + crypto.slice(1)}
        </h2>

        {/* Current Price */}
        <div className="flex justify-between mb-4">
          <p className="text-gray-300"> Current Price: </p>
          <p className="font-bold">${price}</p>
        </div>

        {/* Amount USD */}
        <div className="mb-4">
          <label className="block">Amount (USD)</label>
          <input
            type="number"
            className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-white"
            value={amountUSD}
            onChange={handleUSDChange}
          />
        </div>
        {/* Progress Bar with Slider */}
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={percentageUsed}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg accent-gray-300 cursor-pointer "
          />
          <div className="flex justify-between text-gray-300 text-sm mt-1">
            <span className="absolute left-0">0%</span>
            <span className="absolute left-1/4 -translate-x-1/2">25%</span>
            <span className="absolute left-1/2 -translate-x-1/2">50%</span>
            <span className="absolute left-3/4 -translate-x-1/2">75%</span>
            <span className="absolute right-0">100%</span>
          </div>
        </div>
        {/* Percentage Display */}
        <div>
          <p className="text-sm text-gray-400 mt-6">
            {percentageUsed}% of your balance
          </p>
        </div>

        {/* Amount Currency */}
        <div className="mb-4">
          <label className="block">
            Amount {crypto.charAt(0).toLocaleUpperCase() + crypto.slice(1)}
          </label>
          <input
            type="number"
            className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-white"
            value={amountCrypto}
            onChange={handleCryptoChange}
          />
        </div>
        <div className="text-right">
          <p>Availiable: {balance}</p>
          <p>Availiable: {crypto} </p>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleTransaction}
            className={`px-4 py-2   ${
              selectedAction === "buy"
                ? "bg-green-600  hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } rounded-lg transition-all`}
          >
            {selectedAction.toUpperCase()}
          </button>
        </div>
      </div>
      <p> {userId} </p>
    </div>
  );
}
