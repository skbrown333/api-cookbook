import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

const app = express();

import { logger as log } from "./src/utils/logging";

import routes from "./src/routes/index";

/* Middleware */
import headers from "./src/middleware/headers";
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

app.listen(process.env.PORT || 3000, () => {
  log.info("Server running on port 3000");
  log.info(ENV.db_url);
});

app.use(headers);

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
//app.use("/", routes);
app.use("/", (req, res) => {
  res.send("hello world");
});
