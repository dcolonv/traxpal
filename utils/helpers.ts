interface Rate {
  type: string;
  date: string;
  value: number;
}

interface ExchangeRate {
  date: string;
  buy: number | undefined;
  sell: number | undefined;
}

export function mergeExchangeRates(
  buyRates: Rate[],
  sellRates: Rate[],
): ExchangeRate[] {
  // Create a map to easily look up sell rates by date
  const sellRateMap = new Map(sellRates.map((rate) => [rate.date, rate.value]));

  // Merge the rates
  return buyRates.map((buyRate) => {
    const sellRate = sellRateMap.get(buyRate.date);
    return {
      type: buyRate.type,
      date: buyRate.date,
      buy: buyRate.value,
      sell: sellRate,
    };
  });
}
