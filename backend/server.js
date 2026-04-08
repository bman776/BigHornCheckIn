import express from "express";
import dotenv from "dotenv";
import {sql} from "./config/db.js"

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001;

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

        await sql `CREATE UNIQUE INDEX idx_activeUser_username ON "user"(username) WHERE (is_deleted = FALSE);`;
        await sql ` CREATE UNIQUE INDEX idx_activeUser_email ON "user"(email) WHERE (is_deleted = FALSE);`;

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

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`)
    });
})

