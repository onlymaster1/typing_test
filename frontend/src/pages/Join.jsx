import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket'; // ✅ Use the shared socket instance

export default function Join() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!name || !roomId) {
      alert('Please enter both your name and room ID.');
      return;
    }

    if (!/^\d{4}$/.test(roomId)) {
      alert('Room ID must be exactly 4 digits.');
      return;
    }

    // Save name and roomId in sessionStorage
    sessionStorage.setItem('username', name);
    sessionStorage.setItem('roomId', roomId);

    // Emit join-room to server
    socket.emit('join-room', { name, roomId });

    // Navigate to Room
    navigate(`/room/${roomId}`, { state: { name, roomId } });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-white space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-400">Join a Room</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">Enter your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. Arpit"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Enter 4-digit Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            maxLength={4}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. 5678"
          />
        </div>

        <button
          onClick={handleJoinRoom}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
