import User from './user.js';

const onSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("user:join", async (name) => {
      try {
        const user = await User.findOne({ name });
        if (!user) {
          const newUser = new User({ name, socketId: socket.id });
          await newUser.save();
          io.emit("global:message", `${name} just joined !`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("message:send", (payload) => {
      socket.broadcast.emit("message:receive", payload);
    });

    socket.on("disconnect", async () => {
      try {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
          io.emit("global:message", `${user.name} just left !`);
          await user.delete();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
};

export default onSocket;
