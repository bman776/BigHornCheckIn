// DEV NOTE:
// This was the old way I was using to load the environment variables, which wasnt working becuase then
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars weren't getting 
// loaded in time for redis and ratelimit imports (which get hoisted) 
// (current theory is that those imports must have code inside them already looking for those env vars when evaluated/executed)
/*
import dotenv from "dotenv";
import path from "path"
dotenv.config({path: path.resolve(process.cwd(), "../.env")});
*/

import "dotenv/config"
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s")
});

// DEBUGGING
//console.log(`rate limiter here: ${ratelimiter}`)

export default ratelimiter;