const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // ✅ Adjust if needed
    methods: ['GET', 'POST'],
  },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('join-room', ({ name, roomId }) => {
    if (!roomId || !name) return;

    if (!rooms[roomId]) rooms[roomId] = [];

    const alreadyInRoom = rooms[roomId].some(p => p.name === name);

    if (!alreadyInRoom) {
      rooms[roomId].push({
        name,
        socketId: socket.id,
        score: { wpm: 0, accuracy: 0 },
      });
    } else {
      // In case player refreshes/rejoins with same name
      const player = rooms[roomId].find(p => p.name === name);
      player.socketId = socket.id; // update socketId
    }

    socket.join(roomId);

    // Send room data back
    sendRoomData(roomId);
  });

  socket.on('submit-score', ({ name, roomId, wpm, accuracy }) => {
    if (!roomId || !name) return;

    const players = rooms[roomId];
    if (players) {
      const player = players.find(p => p.name === name);
      if (player) {
        player.score = {
          wpm: typeof wpm === 'number' ? wpm : 0,
          accuracy: typeof accuracy === 'number' ? accuracy : 0,
        };
      }

      sendRoomData(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);

    for (const roomId in rooms) {
      const players = rooms[roomId];
      const filteredPlayers = players.filter(p => p.socketId !== socket.id);

      if (filteredPlayers.length === 0) {
        delete rooms[roomId];
      } else {
        rooms[roomId] = filteredPlayers;
        sendRoomData(roomId);
      }
    }
  });

  function sendRoomData(roomId) {
    const players = rooms[roomId] || [];
    io.to(roomId).emit('room-data', {
      players: players.map(p => ({
        name: p.name,
        socketId: p.socketId,
        wpm: p.score.wpm,
        accuracy: p.score.accuracy,
      })),
    });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
