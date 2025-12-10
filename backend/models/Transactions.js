import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true }
});

const TransactionModel = model("transaction", TransactionSchema);

export default TransactionModel;