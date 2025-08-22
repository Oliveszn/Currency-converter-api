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
      // key: process.env.FIXER_API_KEY,
      baseUrl: "https://api.frankfurter.dev/v1/currencies",
      timeout: 5000,
    },
  },

  // Cache Configuration
  cache: {
    ttl: 300, // 5 minutes in seconds
    maxSize: 100, // maximum number of cached items
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50, // limit each IP to 100 requests per windowMs
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
