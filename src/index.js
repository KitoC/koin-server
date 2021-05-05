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

const corsOptions = { origin: process.env.CORS_URL || "*" };

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

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.response) {
    error = err.response.data.errors;
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("\nERROR\n");
    console.error(error);
    console.log("\nERROR\n");
  }

  console.log(error.status);
  const status = res.set("Content-Type", "application/json");
  res.status(isNumber(error.status) ? error.status : 400);
  res.json({ error });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ready at http://${DOMAIN}:${PORT}`);
});
