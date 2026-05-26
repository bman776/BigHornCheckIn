import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {
    console.log(` Rate limiter triggered for: ${req.method} ${req.url}`);
    try {
        const {success} = await ratelimit.limit("my-rate-limit")

        console.log("Upstash rateLimit success variable: ", success)

        if(!success) {
            return res.status(429).json({
                success: false,
                message: "Number of requests has exceed rate limit, try again later",
                data: null
            });
        }

        next();
    } catch (error) {
        console.log("Rate limit error", error)
        next(error)
    }
}

export default rateLimiter;