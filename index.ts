require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express();

import { logger as log } from "./src/utils/logging";

import routes from "./src/routes/index";

import { ENV } from "./src/constants/constants";

mongoose.connect(ENV.db_url);

// When successfully connected
mongoose.connection.on("connected", () => {
  log.info("Established Mongoose Default Connection");
});

// When connection throws an error
mongoose.connection.on("error", (err) => {
  log.error("Mongoose Default Connection Error : " + err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});

app.use(helmet());
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (origin && origin.indexOf("localhost") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS"));
    }
  },
};
app.use(cors(corsOptions));

let morganLogStyle =
  ":method :url :status :response-time ms - :res[content-length]";

app.use(
  morgan(morganLogStyle, {
    stream: {
      write: (str) => {
        log.info(str);
      },
    },
  })
);

app.use(express.json());
app.use("/", routes);
