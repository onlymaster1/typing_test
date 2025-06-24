import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Typingarea from '../component/Typingarea';
import Leaderboard from '../component/Leaderboard';
import socket from '../socket'; // ✅ Import shared socket

export default function Room() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId: roomParam } = useParams();

  const [name] = useState(() => {
    const fromLocation = location.state?.name;
    if (fromLocation) sessionStorage.setItem('username', fromLocation);
    return fromLocation || sessionStorage.getItem('username');
  });

  const [roomId] = useState(() => {
    const fromLocation = location.state?.roomId || roomParam;
    if (fromLocation) sessionStorage.setItem('roomId', fromLocation);
    return fromLocation || sessionStorage.getItem('roomId');
  });

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!name || !roomId) {
      alert('Missing name or room ID. Redirecting...');
      navigate('/');
      return;
    }

    socket.emit('join-room', { name, roomId });

    const handleRoomData = ({ players }) => {
      setPlayers(players);
    };

    socket.on('room-data', handleRoomData);

    return () => {
      socket.off('room-data', handleRoomData);
    };
  }, [name, roomId, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h2 className="text-3xl text-center font-bold text-purple-400">
        Room ID: {roomId}
      </h2>

      <div className="mt-6">
        <Typingarea players={players} name={name} />
      </div>

      <Leaderboard players={players} />
    </div>
  );
}
