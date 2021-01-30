import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as dotenv from "dotenv";
import { MORGAN_FORMAT } from "./utils/constants";
import { bgBlue } from "chalk";

dotenv.config();

import AuthMiddleware from "./middlewares/auth";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(MORGAN_FORMAT));
app.use(helmet());

// app.use("/api/auth", AuthMiddleware());

export default app;
