require("dotenv").config();
require("./config/mongoDb");

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const authRouter = require("./routes/auth");
const chanRouter = require("./routes/chan");
// const { isAuthenticated } = require("./middlewares/jwt.middleware");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/chan", chanRouter);

module.exports = app;
