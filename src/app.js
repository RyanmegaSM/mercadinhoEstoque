import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
