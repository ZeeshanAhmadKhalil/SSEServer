import { TransactionTypeModel } from "../../Model/TransactionTypeModel.js"

export const SeedTransactionType = async () => {
    await TransactionTypeModel.deleteMany({})
    await TransactionTypeModel.create([
        {
            transactionType: "Deposit"
        },
        {
            transactionType: "Exchange"
        },
        {
            transactionType: "Buy"
        },
        {
            transactionType: "Sell"
        },
    ])
    console.info("Transaction Types are successfully seeded")
}