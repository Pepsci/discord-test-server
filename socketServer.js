const User = require("./models/user.model");
const Message = require("./models/message.model");
const chanModel = require("./models/chan.model");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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

    // trying video chat
    clientSocket.emit("me", clientSocket.id);

    clientSocket.on("calluser", ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    clientSocket.on("answercall", (data) => {
      io.to(data.to).emit("callaccepted", data.signal);
    });

    // on connection, update user status to isConnected: true
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

    // get all users that are isConnected: true
    // and send them to front
    const users = await User.find({ isConnected: true });
    clientSocket.emit("users", users);

    // send the list of users back to front when a client update its profile
    clientSocket.on("user update", async () => {
      clientSocket.emit("users", users);
    });

    // triggered when user clicks to join chan
    clientSocket.on("chan-join", async (data) => {
      try {
        const chan = await chanModel.findById(data).populate("participants");
        clientSocket
          .to(chan)
          .emit("user joined", "someone just joined the room, say hello");
        //TO DO : get users in the room
        // chan.participants.push()
      } catch (e) {
        console.error("join chan :", e);
        clientSocket.emit("error", "couldnt perform requested action");
      }
    });

    clientSocket.on("send-message", async (data) => {
      try {
        console.log(data);
        const newMessage = await Message.create(data);
        const currentChan = await chanModel.findById(data.chan);
        console.log(
          " CURRENT CHAN :",
          currentChan,
          "CURRENT CHAN NAME",
          currentChan.name
        );
        io.emit("receive-message", newMessage);
      } catch (err) {
        console.error(err);
      }
    });

    // on disconnect, set user status back to isConnected: false
    // emit the users list again
    clientSocket.on("disconnect", async () => {
      try {
        const disconnectedUser = await User.findByIdAndUpdate(
          clientSocket.handshake.auth.id,
          { isConnected: false },
          { new: true }
        );
        clientSocket.emit("users", users);
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
