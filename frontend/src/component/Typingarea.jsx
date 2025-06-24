import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sampleTexts } from '../data/dummy';
import socket from '../socket';

export default function Typingarea({ players = [], name, solo = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = solo ? null : (location.state?.roomId || sessionStorage.getItem('roomId'));

  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!solo && (!name || !roomId)) {
      navigate('/');
      return;
    }

    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);

    if (!solo) {
      socket.emit('join-room', { name, roomId });

      const handleRoomData = ({ text: serverText }) => {
        if (serverText) setText(serverText);
      };

      socket.on('room-data', handleRoomData);

      return () => {
        socket.off('room-data', handleRoomData);
      };
    }
  }, [name, roomId, navigate, solo]);

  useEffect(() => {
  // Start the timer only when the test is running and time is left
  if (isRunning && timer > 0) {
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          // Timer hits 0 – calculate final results
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setShowResult(true);

          const finalWPM = calculateWPM();
          const finalAccuracy = calculateAccuracy();

          // Send final score to server
          sendResult(finalWPM, finalAccuracy);

          return 0; // stop timer
        }
        return prevTimer - 1;
      });
    }, 1000);
  }

  // Cleanup interval when component unmounts or timer stops
  return () => {
    clearInterval(intervalRef.current);
  };
}, [isRunning, timer]);



  const handleChange = (e) => {
    const val = e.target.value;
    setUserInput(val);

    if (!isRunning && timer > 0) {
      setStartTime(Date.now());
      setIsRunning(true);
    }

    // Emit real-time score on every keystroke
    if (!solo) {
      socket.emit('submit-score', {
        name,
        roomId,
        wpm: calculateWPM(),
        accuracy: calculateAccuracy(),
      });
    }

    if (val === text) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setShowResult(true);
      sendResult(calculateWPM(), calculateAccuracy());
    }
  };

  const calculateWPM = () => {
    if (!startTime) return 0;
    const words = userInput.trim().split(/\s+/).length;
    const minutes = (60 - timer) / 60;
    return Math.max(0, Math.round(words / minutes));
  };

  const calculateAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correct++;
    }
    return userInput.length > 0
      ? Math.round((correct / userInput.length) * 100)
      : 0;
  };

  const sendResult = (wpm, accuracy) => {
    if (!solo) {
      socket.emit('submit-score', { name, roomId, wpm, accuracy });
    }
  };

  const getHighlightedText = () => {
    return text.split('').map((char, idx) => {
      let className = '';
      if (idx < userInput.length) {
        className = char === userInput[idx] ? 'text-green-400' : 'text-red-400';
      } else if (idx === userInput.length) {
        className = 'bg-yellow-400 text-black animate-pulse';
      }
      return (
        <span key={idx} className={`${className}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="relative max-w-5xl w-full mx-auto mt-6 px-6">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-6 py-10 rounded-3xl shadow-2xl space-y-8 mt-12">
        <h2 className="text-4xl font-bold text-center text-purple-400">
          {solo ? 'Solo Typing Challenge' : 'Multiplayer Typing Challenge'}
        </h2>

        <div className="bg-gray-700 p-8 rounded-xl text-md leading-relaxed h-48 overflow-y-hidden tracking-wide space-y-2">
          {getHighlightedText()}
        </div>

        <textarea
          className="w-full p-6 rounded-xl bg-gray-800 text-white focus:outline-none resize-none h-40 text-lg leading-7"
          value={userInput}
          onChange={handleChange}
          disabled={timer === 0 || showResult}
          placeholder="Start typing here..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-lg font-medium mt-2">
          <div className="bg-blue-700 p-4 rounded-xl shadow-lg">
            <span className="block text-3xl">{timer}s</span>
            <p className="text-sm mt-2">Time Left</p>
          </div>
          <div className="bg-green-700 p-4 rounded-xl shadow-lg">
            <span className="block text-3xl">{calculateWPM()}</span>
            <p className="text-sm mt-2">WPM</p>
          </div>
          <div className="bg-yellow-600 p-4 rounded-xl shadow-lg">
            <span className="block text-3xl">{calculateAccuracy()}%</span>
            <p className="text-sm mt-2">Accuracy</p>
          </div>
        </div>

        {!solo && (
          <div className="pt-6">
            <h3 className="text-xl font-semibold text-center mb-3">Players in Room</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {players
                .slice()
                .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
                .map((player, idx) => (
                  <div key={idx} className="bg-gray-800 p-4 rounded-xl text-center shadow-md">
                    <p className="text-lg font-medium">
                      {player.name}{' '}
                      {player.name === name && <span className="text-sm text-purple-400">(You)</span>}
                    </p>
                    <p className="text-sm text-green-300">
                      WPM: {player.wpm || 0}, Accuracy: {player.accuracy || 0}%
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
