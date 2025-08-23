import axios from "axios";
import config from "../config/index";
import logger from "../utils/logger";
import { handleApiError } from "../middleware/errorHandler";

const client = axios.create({
  timeout: config.apis.exchangeRate.timeout,
  headers: { "Content-Type": "application/json" },
});

const getSupportedCurrenciesFrankFurter = async () => {
  try {
    const url = `${config.apis.frankfurter.baseUrl}/currencies`;

    logger.info(`📡 Fetching supported currencies from: ${url}`);

    const response = await client.get(url);

    if (response.data && typeof response.data === "object") {
      const currencies: Record<string, string> = response.data;

      return {
        success: true,
        source: "frankfurter-api",
        count: Object.keys(currencies).length,
        currencies,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      throw new Error("Frankfurter API returned unexpected format");
    }
  } catch (error: any) {
    logger.error("Frankfurter API Error:", error.message);
    throw handleApiError("Frankfurter API", error);
  }
};

const getFrankRates = async (baseCurrency = "USD") => {
  try {
    const url = `${
      config.apis.frankfurter.baseUrl
    }/latest?base=${baseCurrency.toLocaleUpperCase()}`;

    const response = await client.get(url);

    if (response.data && response.data.rates) {
      return {
        amount: response.data.amount,
        success: true,
        source: "frankfurter-api",
        baseCurrency: response.data.base,
        rates: response.data.rates,
        lastUpdated: response.data.date,
      };
    } else {
      throw new Error("Unexpected Frankfurter response format");
    }
  } catch (error: any) {
    logger.error("Frankfurter API Error:", error.message);
    throw handleApiError("Frankfurter API", error);
  }
};

export { getSupportedCurrenciesFrankFurter, getFrankRates };
