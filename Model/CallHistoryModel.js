import mongoose from "mongoose"

const CallHistorySchema = new mongoose.Schema({
    callDurationInMinutes: {
        type: Number,
        required: true,
    },
    calledOn: {
        type: Date,
        required: true,
    },
    caller: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
})

export const CallHistoryModel = mongoose.model('CallHistory', CallHistorySchema)