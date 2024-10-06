import { format, parseISO } from 'date-fns';

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

export function formatDateLiteral(dateString: string) {
  const date = parseISO(dateString);
  return format(date, 'PPP');
}

export function getPaginationFactorsArray(n: number): number[] {
  if (n <= 0) {
    return [];
  } else if (n === 1) {
    return [0];
  } else if (n === 2) {
    return [1, 0];
  } else {
    return [2, 1, 0];
  }
}
