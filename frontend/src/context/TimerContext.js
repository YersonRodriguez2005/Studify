import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const durations = useMemo(
    () => ({
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    }),
    []
  );

  const [time, setTime] = useState(durations.work);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [history, setHistory] = useState([]); // Inicialización de history como arreglo vacío

  // Iniciar o pausar el temporizador
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Cambiar modo del temporizador
  const setTimerMode = useCallback(
    (newMode) => {
      setMode(newMode);
      setTime(durations[newMode]);
      setIsRunning(false);
    },
    [durations]
  );

  // Agregar una sesión completada al historial
  const addSessionToHistory = useCallback((session) => {
    setHistory((prev) => [...prev, session]);
  }, []);

  // Eliminar una sesión del historial
  const deleteSession = useCallback((id_sesion) => {
    setHistory((prev) => prev.filter((session) => session.id_sesion !== id_sesion));
  }, []);

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            addSessionToHistory({
              id_sesion: Date.now(),
              mode,
              duration: durations[mode] / 60,
              date: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
            });
            return durations[mode];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, mode, durations, addSessionToHistory]);

  return (
    <TimerContext.Provider
      value={{
        time,
        isRunning,
        toggleTimer,
        mode,
        setTimerMode,
        durations,
        history,
        deleteSession,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
