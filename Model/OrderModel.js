import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
    deliveryAddress: {
        type: String,
        required: true,
    },
    isPaymentByHand: {
        type: Boolean,
        required: true,
    },
    createdOn: {
        type: Date,
        required: true,
    },
    orderStatus: {
        type: mongoose.Types.ObjectId,
        ref: 'OrderStatus',
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: 'User',
    },
    // orderProducts: [{
    //     type: mongoose.Types.ObjectId,
    //     required: 'OrderProduct',
    // }],
})

export const OrderModel = mongoose.model('Order', OrderSchema)