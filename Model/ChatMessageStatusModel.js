import mongoose from "mongoose"

const ChatMessageStatusSchema = new mongoose.Schema({
    messageStatus: {
        type: String,
        required: true,
    },
    // chatMessages: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'ChatMessage'
    // }],
})

export const ChatMessageStatusModel = mongoose.model('ChatMessageStatus', ChatMessageStatusSchema)