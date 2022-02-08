const userModel = require("./models/user.model");
const User = require("./models/user.model");
// const connectedUsers = require("./socketFunction/connectedUsers");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  // const io = require("socket.io")(server, {
  //   cors: {
  //     origin: process.env.CLIENT_URL,
  //     methods: ["GET", "POST"],
  //     credentials: true,
  //   },
  // });

  io.use((clientSocket, next) => {
    const token = clientSocket.handshake.auth.token;
    if (!token) {
      return next(new Error("invalid token"));
    }
    clientSocket.token = token;
    next();
  });

  let sockets = [];

  io.on("connection", async (clientSocket) => {
    sockets.push(clientSocket);
    clientSocket.emit("connected");

    clientSocket.broadcast.emit("user connected", {
      userID: clientSocket.handshake.auth.id,
      userEmail: clientSocket.handshake.auth.email,
    });

    User.findByIdAndUpdate(
      clientSocket.handshake.auth.id,
      {
        isConnected: true,
      },
      { new: true }
    )
      .then((dbResponse) => {
        const connectedUser = dbResponse;
      })
      .catch((err) => console.error(err));

    //updated is connected in User Table
    // let users = [];
    const users = await User.find({ isConnected: true });
    // .then((dbResponse) => {
    //   users = dbResponse;
    console.log(" Users Serveur side", users);
    // })
    // .catch((err) => console.error(err));

    // const users = [];

    // for (let [id, socket] of io.of("/").sockets) {
    //   users.push({
    //     userID: id,
    //     userEmail: socket.userEmail,
    //   });
    // }

    clientSocket.emit("users", users);
    //   socket.on("disconnected", () => {
    //     console.log("User disconnected", socket.id);
    //   });
    // });

    clientSocket.on("disconnect", async () => {
      try {
        const disconnectedUser = await User.findByIdAndUpdate(
          clientSocket.handshake.auth.id,
          { isConnected: false },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });

    io.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });
};

module.exports = { registerSocketServer };
