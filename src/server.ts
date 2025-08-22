import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";
import logger from "./utils/logger";
import { urlVersioning } from "./middleware/apiVersioning";
import { errorHandler } from "./middleware/errorHandler";
import Redis from "ioredis";
import currencyRoute from "./routes/currencyRoutes";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;

//this was neccessary to tell ts we are adding redisclient to req
declare global {
  namespace Express {
    interface Request {
      redisClient: Redis;
    }
  }
}

///added the ! at the end to tell ts we know its not undefined since it kept throwing errors
const redisClient = new Redis(process.env.REDIS_URL!);

// rate limiting
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: [string, ...string[]]) =>
      redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 reqs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

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

//routes -> pass redisclient to routes
///versioning
app.use(
  "/api",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  limiter,
  urlVersioning("v1", currencyRoute)
);
// app.use("/api", urlVersioning("v1", currencyRoute));

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`live on ${PORT}`);
});
