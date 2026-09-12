import * as socketClient from 'socket.io-client';

const io = socketClient.io || socketClient.default || socketClient;

let socket = null;

export function createSocket(token) {
  if (socket) return socket;
  socket = io('http://localhost:5000', {
    auth: { token },
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default socket;
