import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Transaction from "./models/Transactions.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://money-tracker-app-iota.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE"]
  })
);

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

app.post("/api/transaction", async (req, res) => {
  try {
    const { name, dateTime, description, price } = req.body;
    const transaction = await Transaction.create({
      name,
      description,
      dateTime,
      price
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

app.get("/api/transaction", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.delete("/api/transaction/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Transaction not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});