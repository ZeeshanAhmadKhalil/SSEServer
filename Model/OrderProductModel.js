import mongoose from "mongoose"

const OrderProductSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
})

export const OrderProductModel = mongoose.model('OrderProduct', OrderProductSchema)