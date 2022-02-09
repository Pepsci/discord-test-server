const chanModel = require("../models/chan.model");
const messageModel = require("../models/message.model");

const sendMessage = (socket) => {
  socket.on("send-message", (data) => {
    messageModel.create();
    socket.to(data.chan).emit("receive-message", data);
  });
};

const saveMessage = () => {};

module.exports = { sendMessage, saveMessage };
