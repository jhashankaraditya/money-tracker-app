const express = require("express");
const cors = require("cors");
require('dotenv').config();
const Transaction = require('./models/Transaction');
const mongoose = require('mongoose');
const app = express();

app.use(cors({
    origin: process.env.REACT_APP_API_URL
  }));
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.send({ body: "testing successful" });
});

function isValidText(text) {
    return /^[A-Za-z\s]+$/.test(text);
}

app.post("/api/transaction", async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    try {
        const { name, description, dateTime, price } = req.body;

        if (!isValidText(name) || !isValidText(description)) {
            return res.status(400).json({ error: "Name and Description must contain only English letters and spaces." });
        }

        const transaction = await Transaction.create({ name, description, dateTime, price });
        res.json(transaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

app.get('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.delete('/api/transaction/:id', async (req, res) => {
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

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});