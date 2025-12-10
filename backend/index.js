import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import Transaction from './models/Transactions.js';

dotenv.config(); // Loading environment variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const __dirname = path.resolve(); // Resolving the directory path

// Connect to MongoDB once when the server starts
const mongoUri = process.env.MONGO_URL;
console.log("Mongo URI from .env: ", process.env.MONGO_URL);
console.log("Process Env Loaded:", process.env);

if (!mongoUri) {
    throw new Error("MongoDB URI (MONGO_URL) is not defined. Check your .env file.");
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1); // Exit the server if the connection fails
    });

// Routes
app.post("/api/transaction", async (req, res) => {
    const { name, dateTime, description, price } = req.body;

    try {
        const transaction = await Transaction.create({ name, description, dateTime, price });
        res.json(transaction);
    } catch (error) {
        console.error("Error creating transaction:", error.message);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

app.get("/api/transaction", async (req, res) => {
    try {
        const transactions = await Transaction.find(); // Fetch transactions
        res.send(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

app.delete('/api/transaction/:id', async (req, res) => {
    const { id: transactionId } = req.params;

    if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID is required' });
    }

    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error("Error deleting transaction:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});