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
//       "Request timeout - Frankfurter API is taking too long to respond"
//     );
//   } else if (error.response) {
//     return new Error(
//       `Frankfurter API error: ${error.response.status} - ${
//         error.response.data?.["error-type"] || error.response.statusText
//       }`
//     );
//   } else if (error.request) {
//     return new Error("Unable to reach Frankfurter API - network error");
//   } else {
//     return new Error(`Frankfurter API service error: ${error.message}`);
//   }
// };

const getSupportedCurrenciesFrankFurter = async () => {
  try {
    const url = `${config.apis.frankfuter.baseUrl}`;

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
    logger.error("❌ ExchangeRate API Error:", error.message);
    throw handleApiError("Frankfurter API", error);
  }
};

export { getSupportedCurrenciesFrankFurter };
