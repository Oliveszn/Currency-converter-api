import express from "express";
import {
  getCurrencies,
  getCurrenciesFrankfurter,
} from "../controller/currencyController";

const router = express.Router();

router.get("/supported/1", getCurrencies);
router.get("/supported/2", getCurrenciesFrankfurter);

export default router;
