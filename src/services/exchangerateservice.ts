import axios from "axios";
import config from "../config/index";
import logger from "../utils/logger";
import { handleApiError } from "../middleware/errorHandler";

const client = axios.create({
  timeout: config.apis.exchangeRate.timeout,
  headers: { "Content-Type": "application/json" },
});

// const handleError = (error: any) => {
//   if (error.code === "ECONNABORTED") {
//     return new Error(
//       "Request timeout - ExchangeRate API is taking too long to respond"
//     );
//   } else if (error.response) {
//     return new Error(
//       `ExchangeRate API error: ${error.response.status} - ${
//         error.response.data?.["error-type"] || error.response.statusText
//       }`
//     );
//   } else if (error.request) {
//     return new Error("Unable to reach ExchangeRate API - network error");
//   } else {
//     return new Error(`ExchangeRate API service error: ${error.message}`);
//   }
// };

const getSupportedCurrencies = async () => {
  try {
    const url = `${config.apis.exchangeRate.baseUrl}/${config.apis.exchangeRate.key}/codes`;

    logger.info(`📡 Fetching supported currencies from: ${url}`);

    const response = await client.get(url);

    if (response.data.result === "success") {
      const currencies: Record<string, string> = {};
      response.data.supported_codes.forEach(
        ([code, name]: [string, string]) => {
          currencies[code] = name;
        }
      );

      return {
        success: true,
        source: "exchangerate-api",
        count: response.data.supported_codes.length,
        currencies,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      throw new Error(`API returned error: ${response.data["error-type"]}`);
    }
  } catch (error: any) {
    logger.error("ExchangeRate API Error:", error.message);
    throw handleApiError("ExchangeRate API", error);
  }
};

const getExchangeRates = async (baseCurrency = "USD") => {
  try {
    const url = `${config.apis.exchangeRate.baseUrl}/${
      config.apis.exchangeRate.key
    }/latest/${baseCurrency.toUpperCase()}`;

    logger.info(`📡 Fetching exchange rates for ${baseCurrency} from: ${url}`);

    const response = await client.get(url);

    if (response.data.result === "success") {
      return {
        success: true,
        source: "exchangerate-api",
        baseCurrency: response.data.base_code,
        rates: response.data.conversion_rates,
        lastUpdated: response.data.time_last_update_utc,
      };
    } else {
      throw new Error(`API returned error: ${response.data["error-type"]}`);
    }
  } catch (error: any) {
    logger.error("ExchangeRate API Error:", error.message);
    throw handleApiError("ExchangeRate API", error);
  }
};

export { getExchangeRates, getSupportedCurrencies };
