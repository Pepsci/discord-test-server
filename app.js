require("dotenv").config();
require("./config/mongoDb");

//Je suis la o//

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
const userRouter = require("./routes/user");
// const { isAuthenticated } = require("./middlewares/jwt.middleware");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/chan", chanRouter);
app.use("/user", userRouter);

app.use("/api/*", (req, res, next) => {
  const error = new Error("Ressource not found.");
  error.status = 404;
  next(error);
});

if (process.env.NODE_ENV === "production") {
  app.use("*", (req, res, next) => {
    // If no routes match, send them the React HTML.
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
}

module.exports = app;
