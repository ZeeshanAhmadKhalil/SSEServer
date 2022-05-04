// ! WARNING :: Dropping DB will remove all data
import mongoose from 'mongoose';
import { ConnectDB } from './SSEContext.js'

const dropDB = async () => {

    await ConnectDB()

    await mongoose.connection.db.dropDatabase()

    console.info("DB Dropped...")

    mongoose.connection.close(() => done());

    process.exit()
}

dropDB()