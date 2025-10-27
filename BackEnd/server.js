require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.get("/", (_, res) => res.send("Welcome to TODO backend"));

// connect to mongodb
const connectToMongoDB = async () => {
  try {
    const mongoUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.qzgaggq.mongodb.net/?appName=Cluster0`;
    await mongoose.connect(mongoUri, { maxPoolSize: 20 });
    console.log("✅ Connected to MongoDB with pooling");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
