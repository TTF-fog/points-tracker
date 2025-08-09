import { addEvent, createHouse, getAllHouses, getHouseByName, updateHousePoints } from "@/db_utils/manager";
import mongoose, { ConnectOptions } from "mongoose";
import config from "./app/config";



const MONGODB_URI = config.mongodb.uri || "not found";
console.log(MONGODB_URI);
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}
  
declare global {
    //var is required here to be global, but not recommended otherwise - ttf
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}
  
let cached = global.mongoose;
  
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    console.log(MONGODB_URI);
    if (cached.conn) {
        console.log('Already Connected');
        return cached.conn;
    }
  
    if (!cached.promise) {
        const opts:ConnectOptions = {
            bufferCommands: true,
            retryWrites: true,
            connectTimeoutMS: 10000,
        };
  
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
                throw error;
            });
    }
  
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
  
    return cached.conn;
}
  
export default dbConnect; 