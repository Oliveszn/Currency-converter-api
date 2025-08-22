import express from "express";
import {
  getCurrencies,
  getCurrenciesFrankfurter,
} from "../controller/currencyController";

const router = express.Router();

// router.get("/supported", getCurrencies);
router.get("/supported", getCurrenciesFrankfurter);

export default router;
