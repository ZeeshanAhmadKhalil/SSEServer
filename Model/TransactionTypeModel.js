import mongoose from "mongoose"

const TransactionTypeSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        required: true,
    },
    // transactions: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Transaction'
    // }],
})

export const TransactionTypeModel = mongoose.model('TransactionType', TransactionTypeSchema)