import * as socketClient from 'socket.io-client';

const io = socketClient.io || socketClient.default || socketClient;

// Use the same API base as your REST calls, so this works in both
// local dev and after deploying (e.g. to Render).
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;
let currentToken = null;

export function createSocket(token) {
  // Same token, socket already alive -> reuse as-is.
  if (socket && currentToken === token && socket.connected) {
    return socket;
  }

  // Same token, but the socket got manually disconnected earlier
  // (e.g. a component unmounted and called .disconnect()) -> reconnect
  // instead of returning a dead instance.
  if (socket && currentToken === token && !socket.connected) {
    socket.connect();
    return socket;
  }

  // Different (or no) token -> tear down any old connection and
  // create a fresh one authenticated as the current user.
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}

export default socket;
