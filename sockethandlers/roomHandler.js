const chanModel = require("../models/chan.model");
const messageModel = require("../models/message.model")

let activeRooms = [];

const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: "",
  };

  activeRooms = [...activeRooms, newActiveRoom];

  console.log("new active rooms: ");
  console.log(activeRooms);

  return newActiveRoom;
};

const createRoom = () => {
  console.log("Creating room");
  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit("room-create", {
    roomDetails,
  });
};

const joinRoom = async () => {
  socket.on("room-join", (room) => {
    try {
      const chan = await chanModel.findById(req.params.id);
      if (chan) {
        const prevMessages = await messageModel.find({ chan : chan._id })
        console.log("Joined room", room);
        socket.join(room);
        socket.to(room).emit("user joined", socket.id);
      } else {
        createRoom();
        console.log("Created and joined room", room);
        socket.join(room);
      }
    } catch (e) {
      console.error("join room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });
};

const roomLeave = async () => {
  try {
    socket.on("room-leave", (room) => {
      socket.leave(room);
      socket.to(room).emit("user left", socket.id);
      if (room.participants.length === 0){

      }
    });
  } catch (e) {
    console.log("[error]", "leave room :", e);
    socket.emit("error", "couldnt perform requested action");
  }
};


module.exports = { createRoom, joinRoom, roomLeave };
