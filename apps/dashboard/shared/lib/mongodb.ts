import mongoose from 'mongoose'

declare global {
    var mongooseConnection: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

const mongoUrl = (() => {
    const url = process.env.MONGODB_URL
    if (!url) {
        throw new Error('MONGODB_URL is not set. Add it to your environment variables.')
    }
    return url
})()

mongoose.set('strictQuery', true)

const globalWithMongoose = globalThis as typeof globalThis & {
    mongooseConnection?: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

let cached = globalWithMongoose.mongooseConnection

if (!cached) {
    cached = { conn: null, promise: null }
    globalWithMongoose.mongooseConnection = cached
}

export async function connectDB() {
    if (cached?.conn) {
        return cached.conn
    }

    if (!cached?.promise) {
        cached!.promise = mongoose.connect(mongoUrl, {
            dbName: process.env.MONGODB_DB ?? 'portfolio_dashboard',
        })
    }

    cached!.conn = await cached!.promise
    return cached!.conn
}
