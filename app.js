require("dotenv").config();
require("./config/mongoDb");
const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

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
