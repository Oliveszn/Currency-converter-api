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
import {
  convertCurrency,
  getAllCurrencies,
  getAllRates,
} from "../services/allServices";

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
    const cacheKey = "supported:currencies";

    //try cache first
    const cachedCurrencies = await req.redisClient.get(cacheKey);
    if (cachedCurrencies) {
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved supported currencies (from cache)",
        data: JSON.parse(cachedCurrencies),
      });
    }

    //otherwise fetch fresh
    const result = await getAllCurrencies();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No data received from getAllCurrencies",
      });
    }

    //Save in cache 12h
    await req.redisClient.setex(cacheKey, 43200, JSON.stringify(result));

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
    const cacheKey = "rates";

    //try cache first
    const cachedRates = await req.redisClient.get(cacheKey);
    if (cachedRates) {
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved rates (from cache)",
        data: JSON.parse(cachedRates),
      });
    }

    const result = await getAllRates();
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No data received from getAllCurrencies",
      });
    }

    //Save in cache 12h
    await req.redisClient.setex(cacheKey, 43200, JSON.stringify(result));

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

////// CONVERTING CURRENCY
const convertAllCurrency = async (req: Request, res: Response) => {
  try {
    const { amount, from, to } = req.body;
    const { rates } = await getAllRates();

    const result = convertCurrency(amount, from, to, rates);

    res.status(200).json({
      success: true,
      message: "Currency conversion successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Currency conversion failed",
      error: error.message,
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
  convertAllCurrency,
};
