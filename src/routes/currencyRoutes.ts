import express from "express";
import {
  getAllServiceCurrencies,
  getAllServicesRates,
  convertAllCurrency,
} from "../controller/currencyController";
import { validateConversion } from "../middleware/validation";
import { getSupportedCurrencies } from "../services/exchangerateservice";
import { getSupportedCurrenciesFrankFurter } from "../services/frankfurterservice";
import type { Request, Response, NextFunction } from "express";

const router = express.Router();

////FOR FETCHING CURRENCIES
router.get("/supported", getAllServiceCurrencies);

///FOR FETCHING RATES
router.get("/rates", getAllServicesRates);

///CONVERSION
router.post("/convert", validateConversion, convertAllCurrency);

//health check
router.get("/health", async (req: Request, res: Response) => {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        redis: "unknown",
        exchangeRateAPI: "unknown",
        frankfurterAPI: "unknown",
      },
    };

    // Check Redis
    try {
      await req.redisClient.ping();
      health.services.redis = "healthy";
    } catch (error) {
      health.services.redis = "unhealthy";
      health.status = "degraded";
    }

    // Check APIs (with timeout)
    const apiChecks = await Promise.allSettled([
      getSupportedCurrencies(),
      getSupportedCurrenciesFrankFurter(),
    ]);

    health.services.exchangeRateAPI =
      apiChecks[0].status === "fulfilled" ? "healthy" : "unhealthy";
    health.services.frankfurterAPI =
      apiChecks[1].status === "fulfilled" ? "healthy" : "unhealthy";

    if (
      health.services.exchangeRateAPI === "unhealthy" &&
      health.services.frankfurterAPI === "unhealthy"
    ) {
      health.status = "unhealthy";
    } else if (
      health.services.exchangeRateAPI === "unhealthy" ||
      health.services.frankfurterAPI === "unhealthy"
    ) {
      health.status = "degraded";
    }

    const statusCode =
      health.status === "healthy"
        ? 200
        : health.status === "degraded"
        ? 206
        : 503;

    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});
export default router;
