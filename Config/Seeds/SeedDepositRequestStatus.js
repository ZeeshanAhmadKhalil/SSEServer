import { DepositRequestStatusModel } from "../../Model/DepositRequestStatusModel.js"

export const SeedDepositRequestStatus = async () => {
    await DepositRequestStatusModel.deleteMany({})
    await DepositRequestStatusModel.create([
        {
            depositRequestStatus: "Pending"
        },
        {
            depositRequestStatus: "Accepted"
        },
        {
            depositRequestStatus: "Rejected"
        },
    ])
    console.info("Deposit Request Status are successfully seeded")
}