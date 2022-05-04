import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
    },
    forExchange: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    longitude: {
        type: Number,
        default: null,
    },
    latitude: {
        type: Number,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now() //! captures the date when server starts not when API is called
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: 'City'
    },
    condition: {
        type: mongoose.Types.ObjectId,
        ref: 'Condition'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    media: [{
        type: mongoose.Types.ObjectId,
        ref: 'Media'
    }],
    // carts: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Cart'
    // }],
    // orderProducts: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'OrderProduct'
    // }],
    // transactions: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Transaction'
    // }],
    // wishlists: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Wishlist'
    // }],

})

export const ProductModel = mongoose.model('Product', ProductSchema)