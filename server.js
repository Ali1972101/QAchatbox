require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});


app.locals.io = io;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qa';
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL || null;

const corsOptions = {
  origin: FRONTEND_URL ? [FRONTEND_URL] : true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(
    path.join(__dirname, "public")
));

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.use((socket, next) => {

    try {

        const token = socket.handshake.auth.token;

        if (!token) {
            return next(
                new Error("Authentication required")
            );
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "secret"
        );

        socket.userId = String(decoded.userId);

        next();

    } catch (error) {

        next(
            new Error("Invalid authentication token")
        );

    }

});

io.on('connection', (socket) => {
  console.log('socket connected', socket.userId);

  socket.join(String(socket.userId));

  socket.on('private_message', async (payload) => {
    try {
      console.log('socket private_message received from', socket.userId, 'payload:', payload && (typeof payload === 'object' ? JSON.stringify({ to: payload.to && String(payload.to), _tempId: payload._tempId }) : String(payload)));
    
      const Message = require('./models/message');
      const msg = await Message.create({ sender: socket.userId, receiver: payload.to, message: payload.content || '', mediaUrl: payload.mediaUrl || '' });
      const msgObj = (msg && msg.toObject) ? msg.toObject() : msg;
      if (payload && payload._tempId) msgObj._tempId = payload._tempId;
      const toRoom = String(payload.to);
      console.log('emitting private_message to', toRoom, 'and', socket.userId, 'msgId:', msgObj._id, 'tempId:', msgObj._tempId);
      io.to(toRoom).emit('private_message', msgObj);
      io.to(String(socket.userId)).emit('private_message', msgObj);
    } catch (err) {
      console.error('socket message save error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.userId);
  });

});



mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");

    try {
      const productsCollection = mongoose.connection.db.collection("products");
      const indexes = await productsCollection.indexes();
      const hasEmailIndex = indexes.some((index) => index.key && index.key.email === 1);

      if (hasEmailIndex) {
        await productsCollection.dropIndex("email_1");
        console.log("Dropped stale email_1 index from products collection");
      }
    } catch (error) {
      console.warn("Could not verify product indexes:", error.message);
    }

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or set a different PORT.`);
        process.exit(1);
      }
      console.error('Server error:', err);
    });

    const openSockets = new Set();
    server.on('connection', (socket) => {
      openSockets.add(socket);
      socket.on('close', () => openSockets.delete(socket));
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    console.warn('Starting server without a MongoDB connection; some features will fail.');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (no DB connection)`);
    });
  });

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});
module.exports = server;


const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Closing server...`);

  for (const s of openSockets) {
    try { s.destroy(); } catch (e) {}
  }

  server.close(() => {
    console.log('Server closed.');

    if (signal === 'SIGUSR2') {
      process.kill(process.pid, 'SIGUSR2');
    } else {
      process.exit(0);
    }
  });


  setTimeout(() => {
    console.error('Forcing shutdown due to timeout.');
    process.exit(1);
  }, 5000);
};

process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
