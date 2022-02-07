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

const joinRoom = () => {
  socket.on('room-join', (room) => {
    console.log("Joined room", room)
    socket.join(room);
});
}

module.exports = {createRoom,joinRoom}
