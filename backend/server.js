const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('join-room', ({ name, roomId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    const alreadyInRoom = rooms[roomId].some(p => p.name === name);
    if (!alreadyInRoom) {
      rooms[roomId].push({
        name,
        socketId: socket.id,
        score: {
          wpm: 0,
          accuracy: 0,
        },
      });
    }

    socket.join(roomId);

    io.to(roomId).emit('room-data', {
      players: rooms[roomId].map(player => ({
        name: player.name,
        socketId: player.socketId,
        wpm: player.score.wpm,
        accuracy: player.score.accuracy,
      })),
    });
  });

  socket.on('submit-score', ({ name, roomId, wpm, accuracy }) => {
    const players = rooms[roomId];
    if (players) {
      const player = players.find(p => p.name === name);
      if (player) {
        player.score = { wpm, accuracy };
      }

      io.to(roomId).emit('room-data', {
        players: players.map(player => ({
          name: player.name,
          socketId: player.socketId,
          wpm: player.score.wpm,
          accuracy: player.score.accuracy,
        })),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(p => p.socketId !== socket.id);

      io.to(roomId).emit('room-data', {
        players: rooms[roomId].map(player => ({
          name: player.name,
          socketId: player.socketId,
          wpm: player.score.wpm,
          accuracy: player.score.accuracy,
        })),
      });

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
