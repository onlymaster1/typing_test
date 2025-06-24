import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket'; // ✅ Shared socket instance

export default function CreateRoom() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!name || !roomId) {
      alert('Please fill in both fields.');
      return;
    }

    if (!/^\d{4}$/.test(roomId)) {
      alert('Room ID must be exactly 4 digits.');
      return;
    }

    // ✅ Save to sessionStorage
    sessionStorage.setItem('username', name);
    sessionStorage.setItem('roomId', roomId);

    // ✅ Emit join-room to server
    socket.emit('join-room', { name, roomId });

    // ✅ Navigate to room with host flag
    navigate(`/room/${roomId}`, {
      state: {
        name,
        roomId,
        isHost: true,
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-white space-y-6">
        <h2 className="text-3xl font-bold text-center text-purple-400">Create a Room</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">Enter your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. 1234"
          />
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
