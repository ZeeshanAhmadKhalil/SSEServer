import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        required: true,
    },
    fcmTokens: {
        type: [String],
        required: true,
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
    },
    // callHistory: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'CallHistory',
    // }],
    // carts: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Cart',
    // }],
    // chatMessage: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'ChatMessage',
    // }],
    // depositRequests: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'DepositRequest',
    // }],
    // orders: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Order',
    // }],
    // transactions: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Transaction',
    // }],
    // wallets: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Wallet',
    // }],
    // wishlists: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Wishlist',
    // }],
    // products: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product',
    // }],
})

export const UserModel = mongoose.model('User', UserSchema)