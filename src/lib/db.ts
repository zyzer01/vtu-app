import mongoose, { Connection } from 'mongoose';

// Define the MONGODB_URI from the environment variables
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

console.log('MONGO_URI:', process.env.NEXT_PUBLIC_MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Interface to type the cached object
interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

// Cached object to the global type (TypeScript compatibility for Next.js)
declare global {
    // Ensure global is not redeclared
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

// Initialize the cache if it's not present in the global object
let cached: MongooseCache = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Database connected');
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
    }

    return cached.conn;
}

export default dbConnect;
