import mongoose from "mongoose"

const CartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
})

export const CartModel = mongoose.model('Cart', CartSchema)