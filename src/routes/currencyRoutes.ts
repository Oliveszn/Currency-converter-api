import express from "express";
import {
  getCurrencies,
  getCurrenciesFrankfurter,
  getAllServiceCurrencies,
} from "../controller/currencyController";

const router = express.Router();

router.get("/supported/1", getCurrencies);
router.get("/supported/2", getCurrenciesFrankfurter);
router.get("/supported/3", getAllServiceCurrencies);

export default router;
