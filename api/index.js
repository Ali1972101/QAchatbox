const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adamuahmed783_db_user:qFxn1y1S0CNbre2m@ath.os2a15v.mongodb.net/?appName=ATH";

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const db = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
  cachedDb = db;
  return db;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Database connection error in API route:", err);
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "QA Serverless API is live" });
});

app.use("/api/auth", authRoutes);

module.exports = app;
