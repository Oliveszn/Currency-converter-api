import express from "express";
import {
  getCurrencies,
  getCurrenciesFrankfurter,
  getAllServiceCurrencies,
  getExchangeRateRates,
  getFrankRateRates,
  getAllServicesRates,
} from "../controller/currencyController";

const router = express.Router();

////FOR FETCHING CURRENCIES
router.get("/supported/1", getCurrencies);
router.get("/supported/2", getCurrenciesFrankfurter);
router.get("/supported/3", getAllServiceCurrencies);

///FOR FETCHING RATES
router.get("/rates/1", getExchangeRateRates);
router.get("/rates/2", getFrankRateRates);
router.get("/rates/3", getAllServicesRates);
export default router;
