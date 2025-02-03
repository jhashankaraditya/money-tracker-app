const {Schema,model} = require('mongoose')

const TransactionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 1 },
});

const TransactionModel=model('transaction',TransactionSchema);

module.exports = TransactionModel;