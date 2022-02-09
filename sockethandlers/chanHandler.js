const chanModel = require("../models/chan.model");
const messageModel = require("../models/message.model");

// let activeChans = [];

// const addNewActiveChan = (userId, socketId) => {
//   const newActiveChan = {
//     chanCreator: {
//       userId,
//       socketId,
//     },
//     participants: [
//       {
//         userId,
//         socketId,
//       },
//     ],
//     chanId: "",
//   };

//   activeChans = [...activeChans, newActiveChan];

//   console.log("new active chans: ");
//   console.log(activeChans);

//   return newActiveChan;
// };

// const createChan = async (socket) => {
//   socket.on("chan-create", data)
//   // const socketId = socket.id;
//   // const userId = socket.user.userId;
//   // const chanDetails = addNewActiveChan(userId, socketId);
//   try {
//     console.log("Creating chan");
//     const newChan = await chanModel.create(
//       { name: req.body },
//       { owner: req.session.user }
//     );
//     socket.emit("chan-created", { newChan });
//   } catch (e) {
//     console.error(e);
//   }
// };

// const joinChan = (socket, chanId) => {
//   socket.on("chan-join", async (data) => {
//     console.log(req.params.id);
//     try {
//       const chan = await chanModel.findById(chanId);
//       if (chan) {
//         const prevMessages = await messageModel.find({ chan: chan._id }).populate("author");
//         console.log("Joined chan", chan);
//         socket.join(chan);
//         socket.to(chan).emit("user joined", socket.id, prevMessages);
//         // chan.participants.push(req.session.user)
//       } else {
//         // createChan(socket);
//         console.log("Created and joined chan", chan);
//         // chan.participants.push(req.session.user)
//         socket.join(chan);
//       }
//     } catch (e) {
//       console.error("join chan :", e);
//       socket.emit("error", "couldnt perform requested action");
//     }
//   });
// };

const chanLeave = async (socket) => {
  try {
    socket.on("chan-leave", (chan) => {
      socket.leave(chan);
      socket.to(chan).emit("user left", socket.id);

      if (chan.participants.length === 0) {
      }
    });
  } catch (e) {
    console.log("[error]", "leave chan :", e);
    socket.emit("error", "couldnt perform requested action");
  }
};

const chanDelete = (socket) => {};

module.exports = {joinChan, chanLeave, chanDelete };
