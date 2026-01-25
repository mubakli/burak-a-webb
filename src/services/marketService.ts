export interface CryptoPrice {
  usd: number;
}

export interface PriceData {
  [key: string]: CryptoPrice;
}

export const marketService = {
  async fetchCryptoPrices(): Promise<PriceData> {
    const res = await fetch("/api/prices");
    if (!res.ok) {
      throw new Error("Failed to fetch prices");
    }
    return res.json();
  },
};
