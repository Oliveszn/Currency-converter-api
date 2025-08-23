import express from "express";
import {
  getAllServiceCurrencies,
  getAllServicesRates,
  convertAllCurrency,
} from "../controller/currencyController";
import { validateConversion } from "../middleware/validation";

const router = express.Router();

////FOR FETCHING CURRENCIES
router.get("/supported", getAllServiceCurrencies);

///FOR FETCHING RATES
router.get("/rates", getAllServicesRates);

///CONVERSION
router.post("/convert", validateConversion, convertAllCurrency);
export default router;
