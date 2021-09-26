import { OrderStatusModel } from "../../Model/OrderStatusModel.js"

export const SeedOrderStatus = async () => {
    await OrderStatusModel.deleteMany({})
    await OrderStatusModel.create([
        {
            orderStatus: "Delivering"
        },
        {
            orderStatus: "Delivered"
        },
    ])
    console.info("Order Status are successfully seeded")
}