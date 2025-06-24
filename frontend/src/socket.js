// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true, // or false if you want to control when it connects
});

export default socket;
