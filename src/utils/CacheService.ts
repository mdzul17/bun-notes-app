import redis from "redis"
import { InvariantError } from "../exceptions/InvariantError";

export class CacheService {
    _client: any;

    constructor() {
        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            }
        })

        this._client.on("error", (err: any) => {
            console.error(err)
        })

        this._client.connect()
    }

    async set(key: string, value: string, expirationInSecond = 3600) {
        await this._client.set(key, value, {
            EX: expirationInSecond
        })
    }

    async get(key: string) {
        const result = await this._client.get(key);
        if (result === null) throw new InvariantError("Cache not found!")

        return result;
    }

    delete(key: string) {
        return this._client.del(key)
    }
}