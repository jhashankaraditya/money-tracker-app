const express = require("express");
const cors = require("cors");
require('dotenv').config();
const Transaction = require('./models/Transaction');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: "*",
  }));
app.use(express.json());

app.get("/test", (req, res) => {
    res.send({ body: "testing successful" });
});

function isValidText(text) {
    return /^[A-Za-z\s]+$/.test(text);
}

app.post("/transaction", async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    try {
        const { name, description, dateTime, price } = req.body;

        if (!isValidText(name) || !isValidText(description)) {
            return res.status(400).json({ error: "Name and Description must contain only English letters and spaces." });
        }

        if (price < 1) {
            return res.status(400).json({ error: "Price must be at least 1." });
        }

        const transaction = await Transaction.create({ name, description, dateTime, price });
        res.json(transaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

app.get('/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.delete('/transaction/:id', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});