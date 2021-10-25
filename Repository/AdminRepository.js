import mongoose from "mongoose";
import { DepositRequestModel } from "../Model/DepositRequestModel.js";
import { DepositRequestStatusModel } from "../Model/DepositRequestStatusModel.js";
import { TransactionModel } from "../Model/TransactionModel.js";
import { WalletModel } from "../Model/WalletModel.js";

export const AdminRepository = {
    GetDepositRequests: async (skip, limit, id) => {
        return await DepositRequestModel
            .find({})
            .sort([['createdOn', -1]])
            .populate('user')
            .populate({ path: 'depositRequestStatus', model: DepositRequestStatusModel }) //todo:  small case for Ref next
            .limit(limit == undefined ? 1000000 : parseInt(skip + limit))
            .skip(skip == undefined ? 0 : parseInt(skip))
            .select()
    },
    ChangeDepositRequestStatus: async (depositRequestId, status) => {
        let depositRequestModel = await DepositRequestModel.findById(depositRequestId).select()
        if (!depositRequestModel)
            return null;
        let depositRequestStatus = await DepositRequestStatusModel.findOne({ depositRequestStatus: status }).select()
        depositRequestModel.depositRequestStatus = mongoose.Types.ObjectId(depositRequestStatus._id)
        if (status == "Accepted") {
            //* Add transaction
            let transactionModel = new TransactionModel({
                upAmount: depositRequestModel.amount,
                downAmount: 0,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bb"), //* Deposit Transaction Type
                user: mongoose.Types.ObjectId(depositRequestModel.user),
            })
            await transactionModel.save()
            //* Add balance in wallet
            let walletModel = await WalletModel.findOne({ user: depositRequestModel.user })
            if (!walletModel) {
                walletModel = new WalletModel({
                    balance: parseFloat(depositRequestModel.amount),
                    user: mongoose.Types.ObjectId(depositRequestModel.user),
                })
            } else {
                walletModel.balance = parseFloat(walletModel.balance) + parseFloat(depositRequestModel.amount)
            }
            await walletModel.save()
        }
        let depositRequest = await depositRequestModel.save()
        if (depositRequest)
            return true
        return false
    },
    GetDepositRequestStatus: async (depositRequestId) => {
        let depositRequestModel = await DepositRequestModel.findById(depositRequestId).populate({ path: 'depositRequestStatus', model: DepositRequestStatusModel }).select()
        return depositRequestModel.depositRequestStatus.depositRequestStatus
    }
}