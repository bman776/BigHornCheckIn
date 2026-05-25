import dotenv from "dotenv";
dotenv.config();

// rateLimiter import comes after loading environment variables because import is reliant on those env vars
import rateLimiter from "./middleware/rateLimiter.js";
import express from "express";
import {sql} from "./config/db.js"
import argon2 from "argon2"
import userRoute from "./routes/userRoute.js"

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

app.get("/", (req, res) => {
    res.send("Server is working")
});

 










app.post("/api/trainingSession", async (req, res) => {
    try {
        // Parse request
        const {title, description, start_time, end_time, trainerID} = req.body
        if (!title) {
            return res.status(400).json({
                success: false,
                message:"Title required to create Training Session",
                data: null
            })
        }
        else if (!start_time) {
            return res.status(400).json({
                success: false,
                message:"Start Datetime required to create Training Session",
                data: null
            })
        }
        else if (!end_time) {
            return res.status(400).json({
                success: false,
                message:"End Datetime required to create Training Session",
                data: null
            })
        }
        else if (!trainerID) {
            return res.status(400).json({
                success: false,
                message:"Trainer ID required to create Training Session",
                data: null
            })
        }

        // create new training session in DB
        const sqlResult = await sql`
        INSERT INTO trainingSession(title, description, start_time, end_time, trainer_id)
        VALUES (${title}, ${description}, ${start_time}, ${end_time}, ${trainerID})
        RETURNING *`
        console.log(sqlResult)
        const trainingSession_data = sqlResult[0]

        // return response
        return res.status(201).json({
            success: true,
            message: "Training Session created",
            data: trainingSession_data
        })

    } catch (error) {
        console.log("Error, failed to create training session")
        res.stataus(500).json({
            success: false,
            message:"Internal Server Error",
            data: null
        })
    }
});











app.use("/api/user", userRoute)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`)
    });
})

