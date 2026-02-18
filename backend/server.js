const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const sessions = new Map();

function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_session', () => {
    const code = generateSessionCode();
    sessions.set(code, { controller: socket.id, devices: [] });
    socket.join(code);
    socket.emit('session_created', code);
    console.log(`Session created: ${code}`);
  });

  socket.on('join_session', (code) => {
    if (sessions.has(code)) {
      socket.join(code);
      const session = sessions.get(code);
      session.devices.push(socket.id);
      socket.emit('session_joined', { success: true, code });
      io.to(session.controller).emit('device_connected', socket.id);
      console.log(`Device ${socket.id} joined session ${code}`);
    } else {
      socket.emit('session_joined', { success: false, message: 'Invalid session code' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup sessions if controller disconnects
    for (const [code, session] of sessions.entries()) {
      if (session.controller === socket.id) {
        io.to(code).emit('session_ended');
        sessions.delete(code);
        console.log(`Session ${code} closed (controller disconnected)`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`ScreenSlaver backend running on port ${PORT}`);
});
