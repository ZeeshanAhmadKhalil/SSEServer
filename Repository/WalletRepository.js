import mongoose from "mongoose";
import { DepositRequestModel } from "../Model/DepositRequestModel.js";
import { DepositRequestStatusModel } from "../Model/DepositRequestStatusModel.js";

export const WalletRepository = {
    DepositRequest: async (bankName, accountNumber, accountTitle, amount, depositedOn, id) => {
        let depositRequestModel = new DepositRequestModel({
            bankName,
            accountNumber,
            accountTitle,
            amount,
            depositedOn,
            depositRequestStatus: mongoose.Types.ObjectId("614f733793e00a99cca623aa"), // * pending status
            user: mongoose.Types.ObjectId(id),
            createdOn: Date.now()
        })
        let depositRequest = await depositRequestModel.save()
        return depositRequest
    },
    GetDepositRequests: async (skip, limit, id) => {
        return await DepositRequestModel
            .find({ user: mongoose.Types.ObjectId(id) })
            .sort([['createdOn', -1]])
            .populate('user')
            .populate({ path: 'depositRequestStatus', model: DepositRequestStatusModel }) //todo:  small case for Ref next
            .limit(limit == undefined ? 1000000 : parseInt(skip + limit))
            .skip(skip == undefined ? 0 : parseInt(skip))
            .select()
    }
}