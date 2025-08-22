import {
  getExchangeRates,
  getSupportedCurrencies,
} from "../services/exchangerateservice";
import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {
  getFrankRates,
  getSupportedCurrenciesFrankFurter,
} from "../services/frankfurterservice";
import { getAllCurrencies, getAllRates } from "../services/allServices";

///FOR GETTING SUPPORTED CURENCIES
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

const getAllServiceCurrencies = async (req: Request, res: Response) => {
  try {
    const result = await getAllCurrencies();

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

////FOR GETTIONG ALL RATES
const getExchangeRateRates = async (req: Request, res: Response) => {
  try {
    const result = await getExchangeRates();

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  } catch (error: any) {
    logger.error("💥 Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve currencies rates",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const getFrankRateRates = async (req: Request, res: Response) => {
  try {
    const result = await getFrankRates();

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  } catch (error: any) {
    logger.error("💥 Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve currencies rates",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const getAllServicesRates = async (req: Request, res: Response) => {
  try {
    const result = await getAllRates();

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  } catch (error: any) {
    logger.error("💥 Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve currencies rates",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export {
  getCurrencies,
  getCurrenciesFrankfurter,
  getAllServiceCurrencies,
  getExchangeRateRates,
  getFrankRateRates,
  getAllServicesRates,
};
