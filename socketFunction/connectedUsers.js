const User = require("../models/user.model");

function connectedUsers() {
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

  let users = [];

  User.find({ isConnected: true })
    .then((dbResponse) => {
      users = dbResponse;
    })
    .catch((err) => console.error(err));

  return users;
}

module.exports = connectedUsers;
