import mongoose from "mongoose"
import config from "config"

const db = config.get("Default")

export const ConnectDB = async () => {
    try {
        await mongoose.connect(db)
        console.info("DB is connected...")
    } catch (error) {
        console.error(error.message)
        process.exit(1); // *! Process exited with an Error
    }
}