const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const isNumber = require("lodash/isNumber");

const api = require("./_config/api");
const apiRoutes = require("./api");

const app = express();
const PORT = process.env.PORT || 4242;
const DOMAIN = process.env.DOMAIN || "localhost";

dotenv.config();
const corsOptions = { origin: "*" };

app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  res.locals.api = api;

  // if (process.env.COINSPOT_KEY !== req.headers.key) {
  //   next({ message: "NOT_AUTHORISED", status: 401 });
  // }

  next();
});

app.use(apiRoutes);

const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("\nERROR\n");
    console.error(error);
    console.log("\nERROR\n");
  }

  res.set("Content-Type", "application/json");
  res.status(isNumber(error.status) ? error.status : 400).json({ error });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ready at http://${DOMAIN}:${PORT}`);
});
