require("dotenv").config();
require("./config/mongoDb");
const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http")
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });


const authRouter = require("./routes/auth");
const { isAuthenticated } = require("./middlewares/jwt.middleware");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
});

module.exports = app;
