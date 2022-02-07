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

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("invalid token"));
    }
    socket.token = token;
    next();
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        userEmail: socket.userEmail,
      });
    }
    console.log(" Users Serveur side", users);
    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      userEmail: socket.userEmail,
    });

    socket.on("disconnet", () => {
      console.log("User disconnected", socket.id);
    });
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
};

module.exports = { registerSocketServer };
