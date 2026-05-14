import { io } from 'socket.io-client';
import { SOCKET_URL } from './publicEnv';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const getSocket = () => socket;
