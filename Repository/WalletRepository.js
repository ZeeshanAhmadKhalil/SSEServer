import mongoose from "mongoose";
import { DepositRequestModel } from "../Model/DepositRequestModel.js";
import { DepositRequestStatusModel } from "../Model/DepositRequestStatusModel.js";
import { WalletModel } from "../Model/WalletModel.js";
import { CartModel } from "../Model/CartModel.js";
import { ProductModel } from "../Model/ProductModel.js";
import { TransactionModel } from "../Model/TransactionModel.js";
import { TransactionTypeModel } from "../Model/TransactionTypeModel.js";

export const WalletRepository = {
    DepositRequest: async (bankName, accountNumber, accountTitle, amount, id) => {
        let depositRequestModel = new DepositRequestModel({
            bankName,
            accountNumber,
            accountTitle,
            amount,
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
    },
    GetTransactions: async (skip, limit, id) => {
        return await TransactionModel
            .find({ user: mongoose.Types.ObjectId(id) })
            .sort([['performedOn', -1]])
            .populate({ path: 'transactionType', model: TransactionTypeModel }) //todo:  small case for Ref next
            .limit(limit == undefined ? 1000000 : parseInt(skip + limit))
            .skip(skip == undefined ? 0 : parseInt(skip))
            .select()
    },
    AddOrderTransactions: async (id) => {
        let cartModel = await CartModel.find({ user: mongoose.Types.ObjectId(id) }).select()
        let transactions = []
        for (const element of cartModel) {
            var productModel = await ProductModel.findById(element.product).select()
            var amount = parseInt(productModel.price * element.quantity)

            //* Adding Transaction of seller
            transactions.push(new TransactionModel({
                upAmount: amount,
                downAmount: 0,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623be"), //* Sell Transaction Type
                user: mongoose.Types.ObjectId(productModel.user),
                soldProduct: mongoose.Types.ObjectId(productModel.id),
                quantity: element.quantity,
            }))

            //* Adding Transaction of buyer
            transactions.push(new TransactionModel({
                upAmount: 0,
                downAmount: amount,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bd"), //* Buy Transaction Type
                user: mongoose.Types.ObjectId(element.user),
                boughtProduct: mongoose.Types.ObjectId(productModel.id),
                quantity: element.quantity,
            }))

            //* Adding Balace in seller Wallet
            var walletModelSeller = await WalletModel.findOne({ user: productModel.user }).select()
            if (!walletModelSeller) {
                walletModelSeller = new WalletModel({
                    balance: parseFloat(amount),
                    user: mongoose.Types.ObjectId(productModel.user),
                })
            } else {
                walletModelSeller.balance = parseFloat(walletModelSeller.balance) + parseFloat(amount)
            }
            await walletModelSeller.save()

            //* Deducing Balace from buyer Wallet
            var walletModelBuyer = await WalletModel.findOne({ user: element.user }).select()
            if (!walletModelBuyer)
                return false
            walletModelBuyer.balance = parseFloat(walletModelBuyer.balance) - parseFloat(amount)
            if (walletModelBuyer.balance < 0)
                return false
            await walletModelBuyer.save()
        }
        await TransactionModel.insertMany(transactions) //todo: check if working
        return true
    },
    AddExchangeTransactions: async (amountDifference, requestedProduct, requestingProduct) => {
        let requested = await ProductModel.findById(requestedProduct).select()
        let requesting = await ProductModel.findById(requestingProduct).select()
        let amount
        let transactions = []
        if (amountDifference > 0) {
            amount = amountDifference
            //* Adding Transaction of requesting user
            transactions.push(new TransactionModel({
                upAmount: amount,
                downAmount: 0,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bc"), //* Exchange Transaction Type
                user: mongoose.Types.ObjectId(requesting.user),
                exchangedProduct: mongoose.Types.ObjectId(requestingProduct),
            }))

            //* Adding Transaction of requested user
            transactions.push(new TransactionModel({
                upAmount: 0,
                downAmount: amount,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bc"), //* Exchange Transaction Type
                user: mongoose.Types.ObjectId(requested.user),
                exchangedProduct: mongoose.Types.ObjectId(requestedProduct),
            }))

            //* Adding Balace in requesting user Wallet
            var walletModelRequesting = await WalletModel.findOne({ user: requesting.user }).select()
            if (!walletModelRequesting) {
                walletModelRequesting = new WalletModel({
                    balance: parseFloat(amount),
                    user: mongoose.Types.ObjectId(requesting.user),
                })
            } else {
                walletModelRequesting.balance = parseFloat(walletModelRequesting.balance) + parseFloat(amount)
            }
            await walletModelRequesting.save()

            //* Deducing Balace from requested user Wallet
            var walletModelRequested = await WalletModel.findOne({ user: requested.user }).select()
            if (!walletModelRequested)
                return false
            walletModelRequested.balance = parseFloat(walletModelRequested.balance) - parseFloat(amount)
            if (walletModelRequested.balance < 0)
                return false
            await walletModelRequested.save()
            await TransactionModel.insertMany(transactions)
            return true
        } else if (amountDifference < 0) {
            amount = Math.abs(amountDifference)
            //* Adding Transaction of requesting user
            transactions.push(new TransactionModel({
                upAmount: 0,
                downAmount: amount,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bc"), //* Exchange Transaction Type
                user: mongoose.Types.ObjectId(requesting.user),
                exchangedProduct: mongoose.Types.ObjectId(requestingProduct),
            }))

            //* Adding Transaction of requested user
            transactions.push(new TransactionModel({
                upAmount: amount,
                downAmount: 0,
                performedOn: Date.now(),
                transactionType: mongoose.Types.ObjectId("614f733793e00a99cca623bc"), //* Exchange Transaction Type
                user: mongoose.Types.ObjectId(requested.user),
                exchangedProduct: mongoose.Types.ObjectId(requestedProduct),
            }))

            //* Adding Balace in requested user Wallet
            var walletModelRequested = await WalletModel.findOne({ user: requested.user }).select()
            if (!walletModelRequested) {
                walletModelRequested = new WalletModel({
                    balance: parseFloat(amount),
                    user: mongoose.Types.ObjectId(requested.user),
                })
            } else {
                walletModelRequested.balance = parseFloat(walletModelRequested.balance) + parseFloat(amount)
            }
            await walletModelRequested.save()

            //* Deducing Balace from requesting user Wallet
            var walletModelRequesting = await WalletModel.findOne({ user: requesting.user }).select()
            if (!walletModelRequesting)
                return false
            walletModelRequesting.balance = parseFloat(walletModelRequesting.balance) - parseFloat(amount)
            if (walletModelRequesting.balance < 0)
                return false
            await walletModelRequesting.save()
            await TransactionModel.insertMany(transactions)
            return true
        } else {
            return false
        }
    },
    GetBalance: async (id) => {
        var model = await WalletModel.findOne({ user: id }).select()
        if (model)
            return model.balance
        return 0
    },
}