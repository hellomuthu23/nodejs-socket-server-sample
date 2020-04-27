const http = require('http');
const io = require('socket.io');
const hostname = '127.0.0.1';
const port = 3000;
const socketServerPort = 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Welcome to socket server world, socket server running on port ${socketServerPort}');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const SocketServer = io.listen(socketServerPort);
const messagePingEventName = 'ping-message';
const liveMessageEventName = 'live-message';
const messagePongEventName = 'pong-message';

SocketServer.on('connection', (socket) => {
  console.info(`Client connected, id=${socket.id}`);

  // Start streaming message
  streamDateTime(socket);

  // Start Listener in ping event name
  socket.on(messagePingEventName, (data) => {
    console.info(`Event received on ${messagePongEventName} : ${data}`);
    // Emit the message back tp pong event name
    emitMessage(socket, messagePongEventName, `Received ${data}`);
  });

  socket.on('disconnect', () => {
    console.info(`Client disconnected, id=${socket.id}`);
  });
});

const streamDateTime = (socket) => {
  emitMessage(socket, liveMessageEventName, `message from socket server @ ${new Date().toUTCString()}`);
  setInterval(() => {
    emitMessage(socket, liveMessageEventName, `message from socket server @ ${new Date().toUTCString()}`);
  }, 1000);
};

const emitMessage = (socket, event, message) => {
  console.info(`Sending messing to Event:${event}, message: ${message}`);
  socket.emit(event, message);
};
