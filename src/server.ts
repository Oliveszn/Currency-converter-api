import express from "express";
import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";
import logger from "./utils/logger";

const app: Express = express();
const PORT = process.env.PORT;

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.listen(PORT, () => {
  logger.info(`live on ${PORT}`);
});
