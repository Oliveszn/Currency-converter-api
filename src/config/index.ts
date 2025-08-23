// this handles all our api calls
import dotenv from "dotenv";
import type { Config } from "../types";
dotenv.config();
const config: Config = {
  server: {
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
  },

  // API Keys and External Services
  apis: {
    exchangeRate: {
      key: process.env.XCHANGE_API_KEY as string,
      baseUrl: "https://v6.exchangerate-api.com/v6",
      timeout: 5000,
    },
    // Ready for your second API
    frankfurter: {
      baseUrl: "https://api.frankfurter.dev/v1",
      timeout: 5000,
    },
  },
};

// Validation function to ensure required config exists
const validateConfig = (cfg: Config) => {
  if (!cfg.apis.exchangeRate.key) {
    throw new Error("Missing required environment variable: XCHANGE_API_KEY");
  }
};

// Run validation
validateConfig(config);

export default config;
