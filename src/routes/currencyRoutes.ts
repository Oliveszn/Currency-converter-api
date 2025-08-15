import express from "express";
import { getCurrencies } from "../controller/currencyController";

const router = express.Router();

router.get("/supported", getCurrencies);

export default router;
