import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {
  convertCurrency,
  getAllCurrencies,
  getAllRates,
} from "../services/allServices";
import type { ConversionRequest } from "../types";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiError } from "../utils/errors";

///FOR GETTING SUPPORTED CURENCIES
const getAllServiceCurrencies = asyncHandler(
  async (req: Request, res: Response) => {
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
      throw new ApiError("No data received from getAllCurrencies", 404);
    }

    //Save in cache 12h
    await req.redisClient.setex(cacheKey, 43200, JSON.stringify(result));

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  }
);

////FOR GETTIONG ALL RATES
const getAllServicesRates = asyncHandler(
  async (req: Request, res: Response) => {
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
      throw new ApiError("No data received from getAllRates", 404);
    }

    //Save in cache 12h
    await req.redisClient.setex(cacheKey, 43200, JSON.stringify(result));

    res.status(200).json({
      success: true,
      message: "Successfully retrieved supported currencies",
      data: result,
    });
  }
);

////// CONVERTING CURRENCY
const convertAllCurrency = asyncHandler(
  async (req: Request<{}, {}, ConversionRequest>, res: Response) => {
    const { amount, from, to } = req.body;
    const { rates } = await getAllRates();

    if (!rates[from] || !rates[to]) {
      throw new ApiError("Unsupported currency", 400);
    }

    const result = convertCurrency(amount, from, to, rates);

    res.status(200).json({
      success: true,
      message: "Currency conversion successful",
      data: result,
    });
  }
);

export { getAllServiceCurrencies, getAllServicesRates, convertAllCurrency };
