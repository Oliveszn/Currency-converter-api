import { handleApiError } from "../middleware/errorHandler";
import {
  getExchangeRates,
  getSupportedCurrencies,
} from "./exchangerateservice";
import {
  getFrankRates,
  getSupportedCurrenciesFrankFurter,
} from "./frankfurterservice";
import type {
  ConversionResponse,
  CurrencyResponse,
  RateResponse,
} from "../types";
import logger from "../utils/logger";

const getAllCurrencies = async (): Promise<CurrencyResponse> => {
  try {
    const [frankfurterResult, exchangeResult] = await Promise.allSettled([
      getSupportedCurrenciesFrankFurter(),
      getSupportedCurrencies(),
    ]);
    let frankfurterCurrencies = {};
    let exchangeCurrencies = {};

    if (frankfurterResult.status === "fulfilled") {
      frankfurterCurrencies =
        frankfurterResult.value.currencies ?? frankfurterResult;
    } else {
      logger.warn("Frankfurter API failed:", frankfurterResult.reason);
    }

    if (exchangeResult.status === "fulfilled") {
      exchangeCurrencies = exchangeResult.value.currencies;
    } else {
      logger.warn("ExchangeRate API failed:", exchangeResult.reason);
    }

    // If both APIs failed, throw error
    if (
      Object.keys(frankfurterCurrencies).length === 0 &&
      Object.keys(exchangeCurrencies).length === 0
    ) {
      throw new Error("All rate providers are currently unavailable");
    }

    //normalize ExchangeRate API (they don’t return names, just codes)
    //here we have to normalize it in such a way that both api match, frankfurter returns both names and code eg: NGN: Nigerian naira
    //but ExhangeRate returns just code eg: NGN, so we had to change it to give NGN:NGn, both names and code esists, use code as name since API doesn’t provide names
    const exchangeNormalized = Object.keys(exchangeCurrencies).reduce(
      (acc: Record<string, string>, code) => {
        acc[code] = code;
        return acc;
      },
      {}
    );

    // merge both apis
    const combined: Record<string, string> = {
      ...exchangeNormalized,
      ...frankfurterCurrencies,
    };

    // remove duplicates by key, we basically ensure not duplicates come in although js objects auto handles that, i think
    // since they both return similar codes eg: usd, we just choose one
    const uniqueCurrencies = Object.keys(combined)
      .sort()
      .reduce((acc: Record<string, string>, code) => {
        acc[code] = combined[code] ?? code;
        return acc;
      }, {});

    const availableSources = [
      ...(Object.keys(exchangeNormalized).length > 0 ? ["frankfurter"] : []),
      ...(Object.keys(frankfurterCurrencies).length > 0
        ? ["exchangeRateAPI"]
        : []),
    ];
    return {
      success: true,
      count: Object.keys(uniqueCurrencies).length,
      currencies: uniqueCurrencies,
      source: availableSources,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err: any) {
    throw handleApiError("Currency Aggregator", err);
  }
};

const getAllRates = async (): Promise<RateResponse> => {
  try {
    // Promise.allSettled is a better way of handling multiple promises, it resolves when all promises are either--
    // fulfilled or rejected, better than using promise.all whichwill reject if any of the promise reject
    const [frankfurterResult, exchangeResult] = await Promise.allSettled([
      getFrankRates(),
      getExchangeRates(),
    ]);

    //we create a hashmap to store if successful
    let frankRates: Record<string, number> = {};
    let exchangeRates: Record<string, number> = {};

    // and we do store
    if (frankfurterResult.status === "fulfilled") {
      frankRates = frankfurterResult.value.rates;
    } else {
      logger.warn("Frankfurter API failed:", frankfurterResult.reason);
    }

    if (exchangeResult.status === "fulfilled") {
      exchangeRates = exchangeResult.value.rates;
    } else {
      logger.warn("ExchangeRate API failed:", exchangeResult.reason);
    }

    // If both APIs failed, throw error
    if (
      Object.keys(frankRates).length === 0 &&
      Object.keys(exchangeRates).length === 0
    ) {
      throw new Error("All rate providers are currently unavailable");
    }

    // merge both apis
    const bestRate: Record<string, number> = {};
    ///we loop through the first api and store it in bestrate which is a hashmap
    for (const [currency, rate] of Object.entries(exchangeRates)) {
      bestRate[currency] = rate;
    }

    //here we loop through the second api but store in bestrate on condition
    for (const [currency, rate] of Object.entries(frankRates)) {
      if (bestRate[currency]) {
        // first condition here, we say if the a currency already exists in the hashmap, we choose the lowest/best rate
        bestRate[currency] = Math.min(bestRate[currency], rate);
      } else {
        //// if its not yet present we add it
        bestRate[currency] = rate;
      }
    }

    const availableSources = [
      ...(Object.keys(frankRates).length > 0 ? ["frankfurter"] : []),
      ...(Object.keys(exchangeRates).length > 0 ? ["exchangeRateAPI"] : []),
    ];

    return {
      success: true,
      baseCurrency: "USD",
      count: Object.keys(bestRate).length,
      rates: bestRate,
      source: availableSources,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    throw handleApiError("Rate Aggregator", error);
  }
};

/// the logic revolves around basecurrencies which is usd, we do amount * rate[tocurrency] / rate[fromCurrency]
/// eg: 1 usd = 1600ngn and 1 usd = 0.92 eur
/// converting 1000ngn to eur 1000(amount) * 0.92 rate[tocurrency] / 1600 rate[fromCurrency]
const convertCurrency = (
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): ConversionResponse => {
  if (!rates[from] || !rates[to]) {
    throw new Error("Unsupported currency");
  }
  const converted = amount * (rates[to] / rates[from]);

  return {
    amount,
    from,
    to,
    converted,
    rate: rates[to] / rates[from],
    timestamp: new Date().toISOString(),
  };
};

export { getAllCurrencies, getAllRates, convertCurrency };
