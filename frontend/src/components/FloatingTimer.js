import React from "react";
import { useTimer } from "../context/TimerContext";
import { Play, Pause } from "lucide-react";

const FloatingTimer = () => {
  const { time, isRunning, toggleTimer } = useTimer();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-4"
      style={{ zIndex: 1000 }}
    >
      <div className="text-xl font-mono">{formatTime(time)}</div>
      <button
        onClick={toggleTimer}
        className="flex items-center gap-2 bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-500 transition duration-300"
      >
        {isRunning ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
};

export default FloatingTimer;
