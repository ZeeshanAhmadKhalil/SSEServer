import mongoose from "mongoose"

// const db = config.get("Default")

export const ConnectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://FaizanAli:12345678Za@sse.athgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        console.info("DB is connected...")
    } catch (error) {
        console.error(error.message)
        process.exit(1); // *! Process exited with an Error
    }
}