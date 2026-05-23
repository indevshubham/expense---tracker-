import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { env, isProduction } from "./config/env";
import { errorHandler, notFound } from "./middleware/error-handler";
import { apiLimiter } from "./middleware/rate-limits";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(apiLimiter);

  if (!isProduction) {
    app.use(morgan("dev"));
  }

  app.use("/api/v1", apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
