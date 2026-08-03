// DEV NOTE:
// This was the old way I was using to load the environment variables, which wasnt working becuase then
// DATABASE_URL env var wasn't getting loaded in time for neon import (which gets hoisted) 
// even though the call to neon() came after dotenv.config()
// (current theory is that neon is somehow looking for DATABASE_URL when the neon import is evaluated?)
/* 
import dotenv from "dotenv";
import path from "path"
dotenv.config({path: path.resolve(process.cwd(), "../../.env")}); 
*/

import "dotenv/config"
import {neon} from "@neondatabase/serverless"

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        // DEV NOTE: Clerk service is now going to handle recording user accounts
        // await sql`
        //     CREATE TABLE IF NOT EXISTS "user"(
        //         id SERIAL PRIMARY KEY,
        //         clerk_id VARCHAR(100) NOT NULL
        //         first_name VARCHAR(50),
        //         last_name VARCHAR(50),
        //         email VARCHAR(50) NOT NULL,
        //         role INTEGER NOT NULL,
        //         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        //         is_deleted BOOLEAN DEFAULT FALSE,
        //         deleted_at TIMESTAMP WITH TIME ZONE
        //     );
        // `;

        // await sql `CREATE UNIQUE INDEX IF NOT EXISTS idx_activeUser_username ON "user"(username) WHERE (is_deleted = FALSE);`;
        // await sql `CREATE UNIQUE INDEX IF NOT EXISTS idx_activeUser_email ON "user"(email) WHERE (is_deleted = FALSE);`;

        // DEV NOTE: Ditching users roles for the sake of simplicity
        // await sql `
        //     CREATE TABLE IF NOT EXISTS role(
        //         id serial PRIMARY KEY,
        //         clerk_id VARCHAR(100) NOT NULL,
        //         role INTEGER NOT NULL,
        //         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        //         is_deleted BOOLEAN DEFAULT FALSE,
        //         deleted_at TIMESTAMP WITH TIME ZONE
        //     );
        // `;

        await sql ` 
            CREATE TABLE IF NOT EXISTS trainingSession(
                id SERIAL PRIMARY KEY,
                title VARCHAR(50) NOT NULL,
                description VARCHAR(200),
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                trainer_id VARCHAR(100) NOT NULL,
                is_deleted BOOLEAN DEFAULT FALSE,
                deleted_at TIMESTAMP WITH TIME ZONE
            );
        `;

        await sql `
            CREATE TABLE IF NOT EXISTS attendance(
                id SERIAL PRIMARY KEY,
                attendee_id VARCHAR(100) NOT NULL,
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