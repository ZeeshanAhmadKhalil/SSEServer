import mongoose from "mongoose"

const OrderStatusSchema = new mongoose.Schema({
    orderStatus: {
        type: String,
        required: true,
    },
    // orders: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Order'
    // }],
})

export const OrderStatusModel = mongoose.model('OrderStatus', OrderStatusSchema)