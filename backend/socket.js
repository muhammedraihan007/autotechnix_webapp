const jwt = require('jsonwebtoken');

let io;
const userSockets = {}; // In-memory store for userId -> socketId

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    // Middleware for authentication
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
      } catch (err) {
        return next(new Error('Authentication error'));
      }
    });

    // Handle connection
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id} with userId: ${socket.userId}`);
      userSockets[socket.userId] = socket.id;
    
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const userId in userSockets) {
          if (userSockets[userId] === socket.id) {
            delete userSockets[userId];
            break;
          }
        }
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  getUserSockets: () => {
    return userSockets;
  }
};
