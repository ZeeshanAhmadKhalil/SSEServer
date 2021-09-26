import mongoose from "mongoose"

const TransactionSchema = new mongoose.Schema({
    upAmount: {
        type: Number,
        required: true,
    },
    downAmount: {
        type: Number,
        required: true,
    },
    performedOn: {
        type: Date,
        default: Date.now(),
    },
    transactionType: {
        type: mongoose.Types.ObjectId,
        ref: 'TransactionType'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    exchangedProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    soldProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    boughtProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
})

export const TransactionModel = mongoose.model('Transaction', TransactionSchema)