const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/call/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'call.html'));
});

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');

    socket.on('signal', (data) => {
      socket.to(roomId).emit('signal', data);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected');
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
