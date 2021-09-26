import mongoose from "mongoose"

const WalletSchema = new mongoose.Schema({
    balance: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
})

export const WalletModel = mongoose.model('Wallet', WalletSchema)