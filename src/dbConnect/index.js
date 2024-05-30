import mongoose from "mongoose";
import { db_name } from "../constants.js";

const dbConnect = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`); 
        console.log(`momgodb connected, on db host ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("mongodb connection error", error);
        throw error;
    }
}

export default dbConnect;