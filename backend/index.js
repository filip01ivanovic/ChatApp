const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const server = require("http").createServer(app);
require("dotenv").config();
// configurating websocket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    credentials: "true",
  },
});

 // enabling cors
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use("", authRouter); // using auth router

const pool = require("./db"); // importing database pool

// handling websocket connections
io.on('connection', (socket) => {
  // listening for incoming message events
  socket.on('message', async (data) => {
    // console.log("Backend: ", data);
    await saveMessageToDatabase(data);
    // broadcast message to all clients
    io.sockets.emit('message', data);
  });

  socket.on('getMessages', async () => {
    const messages = await getLatestMessages();
    io.sockets.emit('messages', messages);
  });
});

// saving massage to the database
const saveMessageToDatabase = async (data) => {
  const { username, text, timestamp } = data;
  await pool.query('INSERT INTO messages (username, text, timestamp) VALUES ($1, $2, $3)', [username, text, timestamp]);
};

// retrieving messages from the database
const getLatestMessages = async () => {
  const result = await pool.query('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100');
  return result.rows;
};

// starting the server on port 3000
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});