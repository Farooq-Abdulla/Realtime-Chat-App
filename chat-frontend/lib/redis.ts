
import { Redis } from "ioredis";

function getRedisUrl(){
    if(process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }
    throw new Error('Redis_URL is not defined')
}

export const redis= new Redis(getRedisUrl());


