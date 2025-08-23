import type { Request, Response, NextFunction } from "express";
import type { ConversionRequest } from "../types/index";

// Currency code validation (ISO 4217 format)
const isValidCurrencyCode = (code: string): boolean => {
  return (
    typeof code === "string" &&
    code.length === 3 &&
    /^[A-Z]{3}$/.test(code.toUpperCase())
  );
};

// Amount validation
const isValidAmount = (amount: any): boolean => {
  const num = Number(amount);
  return !isNaN(num) && isFinite(num) && num > 0 && num <= 10000000;
};

export const validateConversion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, from, to }: ConversionRequest = req.body;

  // check required fields
  if (!amount || !from || !to) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: amount, from, to",
      timestamp: new Date().toISOString(),
    });
  }

  // validate amount
  if (!isValidAmount(amount)) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a positive number between 0.01 and 10,000,000",
      timestamp: new Date().toISOString(),
    });
  }

  // we check if both codes are valid currency code
  if (!isValidCurrencyCode(from)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid source currency code. Must be 3-letter ISO code (e.g., USD)",
      timestamp: new Date().toISOString(),
    });
  }

  if (!isValidCurrencyCode(to)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid target currency code. Must be 3-letter ISO code (e.g., EUR)",
      timestamp: new Date().toISOString(),
    });
  }

  // here we check if we converting to the same currency
  if (from.toUpperCase() === to.toUpperCase()) {
    return res.status(400).json({
      success: false,
      message: "Source and target currencies cannot be the same",
      timestamp: new Date().toISOString(),
    });
  }

  // Normalize currency codes to uppercase
  req.body.from = from.toUpperCase();
  req.body.to = to.toUpperCase();
  req.body.amount = Number(amount);

  next();
};
