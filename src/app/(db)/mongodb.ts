import mongoose from "mongoose";
import { MONGODB_URI } from "../(config)/constants";

export const connectDB = async () => {
    try {
        console.log("MONGODB: connecting to ");
        console.log(MONGODB_URI);
        const { connection } = await mongoose.connect(MONGODB_URI as string);
        if (connection.readyState === 1) {
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
