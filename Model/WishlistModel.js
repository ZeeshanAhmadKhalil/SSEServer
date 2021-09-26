import mongoose from "mongoose"

const WishlistSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
})

export const WishlistModel = mongoose.model('Wishlist', WishlistSchema)