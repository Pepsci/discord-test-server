const express = require("express");

require("dotenv").config();
require("./config/mongoDb");

const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const authRouter = require("./routes/auth");
const { isAuthenticated } = require("./middlewares/jwt.middleware");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);

module.exports = app;
