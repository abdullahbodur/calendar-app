const express = require("express");
const cors = require("cors");
const dotev = require("dotenv");
const router = require("./router");
const logger = require("./utilites/logger");
const connectDatabase = require("./helpers/database/databaseH");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const app = express();

dotev.config({
  path: "./config/config.env",
});

connectDatabase();

app.use(express.json());

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(logger);
router(app);
app.use(customErrorHandler);

const PORT = process.env.NODE_DOCKER_PORT;

app.listen(PORT, async () => {
  console.log(`Server started at ${PORT}`);
});
