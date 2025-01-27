import http from 'http';
import { Server } from 'socket.io';

const initializeSocketIo = (app) => {
  const server = http.createServer(app);
  const io = new Server(server);
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  });
  return { server, io };
};

export default initializeSocketIo;
