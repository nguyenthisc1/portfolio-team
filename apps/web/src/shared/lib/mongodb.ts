import { Db, MongoClient, Collection, Document } from 'mongodb'

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient>
    var _mongoDb: Db | null
}

const mongoUrl = (() => {
    const url = process.env.MONGODB_URL
    if (!url) {
        throw new Error('MONGODB_URL is not set. Add it to your environment variables.')
    }
    return url
})()

const dbName = process.env.MONGODB_DB ?? 'portfolio_dashboard'

// Initialize the client and promise only once globally in dev/hot-reload environments
if (!global._mongoClientPromise) {
    const client = new MongoClient(mongoUrl)
    global._mongoClientPromise = client.connect()
    global._mongoDb = null
}

export async function connectDB(): Promise<Db> {
    if (!global._mongoDb) {
        const client = await global._mongoClientPromise
        global._mongoDb = client.db(dbName)
    }
    return global._mongoDb as Db
}

export async function getCollection<TSchema extends Document = any>(
    name: string,
): Promise<Collection<TSchema>> {
    const db = await connectDB()
    return db.collection<TSchema>(name)
}
