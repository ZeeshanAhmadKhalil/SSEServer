import mongoose from "mongoose"

const ExchangeSchema = new mongoose.Schema({
    isPaymentByHand: {
        type: Boolean,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    isExchanged: {
        type: Boolean,
        required: true,
    },
    requestingProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    requestedProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
})

export const ExchangeModel = mongoose.model('Exchange', ExchangeSchema)