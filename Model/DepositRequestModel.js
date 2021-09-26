import mongoose from "mongoose"

const DepositRequestSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    accountTitle: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    depositedOn: { //* when user transferred money to admin account
        type: Date,
        required: true,
    },
    createdOn: { //* when entry is created
        type: Date,
        default: Date.now()
    },
    depositRequestStatus: {
        type: mongoose.Types.ObjectId,
        ref:'DepositRequestStatus'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
})

export const DepositRequestModel = mongoose.model('DepositRequest', DepositRequestSchema)