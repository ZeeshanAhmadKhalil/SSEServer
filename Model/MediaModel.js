import mongoose from "mongoose"

const MediaSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    // chatMessage: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'ChatMessage'
    // },
    // product: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product'
    // },
})

export const MediaModel = mongoose.model('Media', MediaSchema)