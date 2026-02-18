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
    // Store session with controller ID and empty devices map
    sessions.set(code, {
      controller: socket.id,
      devices: new Map() // Use Map for easier management by socket.id
    });
    socket.join(code);
    socket.emit('session_created', code);
    console.log(`Session created: ${code}`);
  });

  socket.on('join_session', ({ code, name, type }) => {
    const session = sessions.get(code);

    if (session) {
      socket.join(code);

      // Create initial device state
      const newDevice = {
        id: socket.id,
        name: name || `Device ${session.devices.size + 1}`,
        type: type || 'phone',
        currentState: {
          battery: 100,
          signal: 5,
          currentApp: 'home'
        }
      };

      // Store device in session
      session.devices.set(socket.id, newDevice);

      // Notify the joiner
      socket.emit('session_joined', { success: true, code });

      // Notify the controller (and potentially others) with UPDATED LIST
      const deviceList = Array.from(session.devices.values());
      io.to(session.controller).emit('session_updated', { devices: deviceList });

      console.log(`Device ${name} (${socket.id}) joined session ${code}`);
    } else {
      socket.emit('session_joined', { success: false, message: 'Invalid session code' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Check if it was a controller or a device
    for (const [code, session] of sessions.entries()) {
      if (session.controller === socket.id) {
        // Controller left - kill session
        io.to(code).emit('session_ended');
        sessions.delete(code);
        console.log(`Session ${code} closed (controller disconnected)`);
      } else if (session.devices.has(socket.id)) {
        // Device left - remove and notify controller
        session.devices.delete(socket.id);
        const deviceList = Array.from(session.devices.values());
        io.to(session.controller).emit('session_updated', { devices: deviceList });
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`ScreenSlaver backend running on port ${PORT}`);
});
