// this handles all our api calls
import dotenv from "dotenv";
dotenv.config();
const config = {
  server: {
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
  },

  // API Keys and External Services
  apis: {
    exchangeRate: {
      key: process.env.XCHANGE_API_KEY,
      baseUrl: "https://v6.exchangerate-api.com/v6",
      timeout: 5000,
    },
    // Ready for your second API
    frankfuter: {
      baseUrl: "https://api.frankfurter.dev/v1",
      timeout: 5000,
    },
  },
};

// Validation function to ensure required config exists
const validateConfig = () => {
  const required = ["XCHANGE_API_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Run validation
validateConfig();

export default config;
