import dotenv from "dotenv";
dotenv.config();

// rateLimiter import comes after loading environment variables because import is reliant on those env vars
import rateLimiter from "./middleware/rateLimiter.js";
import express from "express";
import argon2 from "argon2"
import userRoute from "./routes/userRoute.js"
import trainingSessionRoute from "./routes/trainingSessionRoute.js"

const app = express();
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

const USER_ROLE = Object.freeze({
    TRAINER: 1,
    STUDENT: 2
})

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "user"(
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(50) NOT NULL,
                password_hash TEXT NOT NULL,
                role INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                is_deleted BOOLEAN DEFAULT FALSE,
                deleted_at TIMESTAMP WITH TIME ZONE
            );
        `;

        await sql `CREATE UNIQUE INDEX IF NOT EXISTS idx_activeUser_username ON "user"(username) WHERE (is_deleted = FALSE);`;
        await sql `CREATE UNIQUE INDEX IF NOT EXISTS idx_activeUser_email ON "user"(email) WHERE (is_deleted = FALSE);`;

        await sql ` 
            CREATE TABLE IF NOT EXISTS trainingSession(
                id SERIAL PRIMARY KEY,
                title VARCHAR(50) NOT NULL,
                description VARCHAR(200),
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                trainer_id INTEGER NOT NULL REFERENCES "user"(id),
                is_deleted BOOLEAN DEFAULT FALSE,
                deleted_at TIMESTAMP WITH TIME ZONE
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS attendance(
                id SERIAL PRIMARY KEY,
                attendee_id INTEGER NOT NULL REFERENCES "user"(id),
                trainingSession_id INTEGER NOT NULL REFERENCES trainingSession(id),
                attended BOOLEAN NOT NULL,
                is_deleted BOOLEAN DEFAULT FALSE,
                deleted_at TIMESTAMP WITH TIME ZONE
            );
        `;
        
        console.log("Database initialized succesfully");

    } catch(error) {
        console.log("Error initializing Database", error);
        process.exit(1); 
    }
}

// set up routes
app.get("/", (req, res) => {
    res.send("Server is working")
});
app.use("/api/trainingSession", );
app.use("/api/user", userRoute)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`)
    });
})

