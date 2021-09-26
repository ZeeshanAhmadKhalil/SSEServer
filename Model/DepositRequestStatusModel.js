import mongoose from "mongoose"

const DepositRequestStatusSchema = new mongoose.Schema({
    depositRequestStatus: {
        type: String,
        required: true,
    },
    // depositRequests: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'DepositRequest'
    // }],
})

export const DepositRequestStatusModel = mongoose.model('DepositRequestStatus', DepositRequestStatusSchema)