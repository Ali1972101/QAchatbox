require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");

const cors = require("cors");

const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "QA Backend API is live and running" });
});

app.use("/api/auth", authRoutes);

if (MONGODB_URI) {
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
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

if (process.env.NODE_ENV !== "production" || require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
