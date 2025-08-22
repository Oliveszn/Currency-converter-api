import { getSupportedCurrencies } from "../services/exchangerateservice";
import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { getSupportedCurrenciesFrankFurter } from "../services/frankfurterservice";

const getCurrencies = async (req: Request, res: Response) => {
  try {
    const result = await getSupportedCurrencies();

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  } catch (error: any) {
    logger.error("💥 Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve supported currencies",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const getCurrenciesFrankfurter = async (req: Request, res: Response) => {
  try {
    const result = await getSupportedCurrenciesFrankFurter();

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  } catch (error: any) {
    logger.error("💥 Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve supported currencies",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export { getCurrencies, getCurrenciesFrankfurter };
