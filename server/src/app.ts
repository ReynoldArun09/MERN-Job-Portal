import express, { type Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { ParsedEnvVariables } from "./config";
import { ErrorMiddleware, RouteNotFound } from "./middlewares";

const app: Application = express();
const swaggerSpec = YAML.load("./src/lib/swagger.yaml");

app.use(helmet());
app.use(
  cors({
    origin: ParsedEnvVariables.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.disable("x-powered-by");

app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(RouteNotFound);
app.use(ErrorMiddleware);

export default app;
