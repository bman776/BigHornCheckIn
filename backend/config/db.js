import {neon} from "@neondatabase/serverless"
import dotenv from "dotenv";

dotenv.config();

// DEBUGGING 
console.log(process.env.DATABASE_URL);

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);