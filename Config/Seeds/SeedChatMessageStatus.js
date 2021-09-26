import { ChatMessageStatusModel } from "../../Model/ChatMessageStatusModel.js"

export const SeedChatMessageStatus = async () => {
    await ChatMessageStatusModel.deleteMany({})
    await ChatMessageStatusModel.create([
        {
            messageStatus: "Sent"
        },
        {
            messageStatus: "Recieved"
        },
        {
            messageStatus: "Seen"
        },
        {
            messageStatus: "Not Sent"
        },
    ])
    console.info("Chat Message Status are successfully seeded")
}