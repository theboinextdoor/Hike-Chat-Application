// socketMiddleware.js
import { setSocketConnection, clearUser } from '../redux/userSlice';

const socketMiddleware = (store) => {
  let socket = null;

  return (next) => (action) => {
    if (setSocketConnection.match(action)) {
      // If a socket connection already exists, close it
      if (socket) {
        socket.close();
      }

      // Create a new socket connection
      socket = action.payload;

      // Optionally, you can add event listeners here
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    if (clearUser.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};

export default socketMiddleware;
