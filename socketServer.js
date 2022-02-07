const User = require("./models/user.model");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // io.use((socket, next) => {
  //   const userEmail = socket.handshake.auth.email;
  //   if (!userEmail) {
  //     return next(new Error("invalid Email !!"));
  //   }
  //   socket.userEmail = userEmail;
  //   next();
  // });

  // io.use((socket, next) => {
  //   const token = socket.handshake.auth.token;
  //   if (!token) {
  //     return next(new Error("invalid token"));
  //   }
  //   socket.token = token;
  //   next();
  // });

  io.on("connection", (socket) => {
    console.log("-----a user connected-----");

    socket.emit("connected");

    // User.findByIdAndUpdate(
    //   socket.auth.id,
    //   {
    //     isConnected: true,
    //   },
    //   { new: true }
    // )
    //   .then((dbResponse) => {
    //     const connectedUser = dbResponse.data;
    //   })
    //   .catch((err) => console.error(err));

    // console.log(connectedUser);
    // //updated is connected in User Table
    // User.find({ isConnected: true })
    //   .then((dbResponse) => {
    //     const users = dbResponse.data;
    //   })
    //   .catch((err) => console.error(err));

    // const users = [];
    // for (let [id, socket] of io.of("/").sockets) {
    //   users.push({
    //     userID: id,
    //     userEmail: socket.userEmail,
    //   });
    // }

    // console.log(" Users Serveur side", users);
    //   socket.emit("users", User);

    //   socket.broadcast.emit("user connected", {
    //     userID: socket.id,
    //     userEmail: socket.userEmail,
    //   });

    //   socket.on("disconnected", () => {
    //     console.log("User disconnected", socket.id);
    //   });
    // });

    io.on("disconnect", (reason) => console.log(reason));

    io.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });
};

module.exports = { registerSocketServer };
