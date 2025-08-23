import express from "express";
import {
  getAllServiceCurrencies,
  getAllServicesRates,
  convertAllCurrency,
} from "../controller/currencyController";

const router = express.Router();

////FOR FETCHING CURRENCIES
router.get("/supported", getAllServiceCurrencies);

///FOR FETCHING RATES
router.get("/rates", getAllServicesRates);

///CONVERSION
router.post("/convert", convertAllCurrency);
export default router;
