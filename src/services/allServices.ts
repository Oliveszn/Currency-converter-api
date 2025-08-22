import axios from "axios";
import { handleApiError } from "../middleware/errorHandler";
import {
  getExchangeRates,
  getSupportedCurrencies,
} from "./exchangerateservice";
import {
  getFrankRates,
  getSupportedCurrenciesFrankFurter,
} from "./frankfurterservice";

const getAllCurrencies = async () => {
  try {
    // fetch from Frankfurter
    const frankfurterResult = await getSupportedCurrenciesFrankFurter();
    const frankfurterCurrencies =
      frankfurterResult.currencies ?? frankfurterResult;

    // fetch from ExchangeRate API
    const exchangeResult = await getSupportedCurrencies();
    const exchangeCurrencies = exchangeResult.currencies;

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

    return {
      success: true,
      count: Object.keys(uniqueCurrencies).length,
      currencies: uniqueCurrencies,
      sources: ["frankfurter", "exchangeRateAPI"],
      lastUpdated: new Date().toISOString(),
    };
  } catch (err: any) {
    throw handleApiError("Currency Aggregator", err);
  }
};

const getAllRates = async () => {
  try {
    ///from frankfurter
    const frankfurterResult = await getFrankRates();
    const frankRates: Record<string, number> = frankfurterResult.rates;

    // fetch from ExchangeRate API
    const exchangeResult = await getExchangeRates();
    const exchangeRates: Record<string, number> = exchangeResult.rates;

    // merge both apis
    const combined: Record<string, number> = {};
    for (const [currency, rate] of Object.entries(exchangeRates)) {
      combined[currency] = rate;
    }
    for (const [currency, rate] of Object.entries(frankRates)) {
      if (combined[currency]) {
        combined[currency] = Math.min(combined[currency], rate);
      } else {
        combined[currency] = rate;
      }
    }

    return {
      success: true,
      baseCurrency: "USD",
      count: Object.keys(combined).length,
      rates: combined,
      sources: ["frankfurter", "exchangeRateAPI"],
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    throw handleApiError("Rate Aggregator", error);
  }
};

export { getAllCurrencies, getAllRates };
