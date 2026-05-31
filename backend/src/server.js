import dotenv from "dotenv";
dotenv.config();

// rateLimiter import comes after loading environment variables because import is reliant on those env vars
import rateLimiter from "./middleware/rateLimiter.js";
import express from "express";
import argon2 from "argon2"
import userRoute from "./routes/userRoute.js"
import trainingSessionRoute from "./routes/trainingSessionRoute.js"
import { initDB } from "./config/db.js"

const PORT = process.env.PORT || 5001;


const app = express();

// set up middleware
app.use(rateLimiter);
app.use(express.json());

// set up routes
app.use("/api/trainingSession", trainingSessionRoute);
app.use("/api/user", userRoute)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`)
    });
})

