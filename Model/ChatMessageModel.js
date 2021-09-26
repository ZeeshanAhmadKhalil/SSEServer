import mongoose from "mongoose"

const ChatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sentOn: {
        type: Date,
        default: Date.now()
    },
    messageStatus: {
        type: mongoose.Types.ObjectId,
        ref: 'ChatMessageStatus'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    media: [{
        type: mongoose.Types.ObjectId,
        ref: 'Media'
    }],
})

export const ChatMessageModel = mongoose.model('ChatMessage', ChatMessageSchema)