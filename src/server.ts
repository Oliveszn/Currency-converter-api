import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";
import logger from "./utils/logger";
import { urlVersioning } from "./middleware/apiVersioning";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;

//middleware
app.use(helmet());
app.use(
  cors({
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

///versioning
app.use("/api/v1", urlVersioning("v1"));

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`live on ${PORT}`);
});
