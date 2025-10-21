import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config/default";
import { Middleware } from "./middlewares/middleware";

const app = express();

const corsOptions: CorsOptions = {
  origin: [config.appUrl!],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.use(Middleware);

app.use("/api", routes);

app.use(errorHandler);

export default app;
