import { sql } from "../config/db.js"

const USER_ROLE = Object.freeze({
    TRAINER: 1,
    STUDENT: 2
})

async function getUserByID(req, res) {
    try {
        // Parse request
        const {userID} = req.params
        if (!userID) {
            return res.status(400).json({message:"user ID requried to get user"})
        }
        else if (!Number.isInteger(Number(userID))) {
            return res.status(400).json({message:"user ID must be an Integer to get user"})
        }

        // Get User from the DB
        const sqlResult = await sql`
        SELECT *
        FROM "user"
        WHERE id = ${userID}
        ORDER BY created_at DESC`
        console.log(sqlResult)

        // Check if user found
        if (sqlResult.length < 1) {
            res.status(404).json({
                success: false,
                message: "User could not be found",
                data: null
            })
        }

        // Return response
        const user_data = sqlResult[0]
        res.status(200).json({
            success: true,
            message: "User Found",
            data: user_data
        }) 

    } catch (error) {
        console.log("Error, failed to get User")
        res.status(500).json({
            success: false,
            message:`Internal Server Error: ${error}`,
            data: null
        })
    }
}

async function addUser(req, res) {
    try {
        // Parse request 
        const {first_name, last_name, username, email, password, role} = req.body
        if (!first_name) {
            return res.status(400).json({
                success: false,
                message:"first name requried to create user",
                data: null
            })
        }
        else if (!last_name) {
            return res.status(400).json({
                success: false,
                message:"last name requried to create user",
                data: null
            })
        }
        else if (!username) {
            return res.status(400).json({
                success: false,
                message:"username requried to create user",
                data: null
            })
        }
        else if (!email) {
            return res.status(400).json({
                success: false,
                message:"email requried to create user",
                data: null
            })
        }
        else if (!password) {
            return res.status(400).json({
                success: false,
                message:"password hash requried to create user",
                data: null
            })
        }
        else if (!role) {
            return res.status(400).json({message:"role required to create user"})
        } else if (!(role in USER_ROLE)) {
            return res.status(400).json({message:`${role} is not a valid role for a user`})
        } 

        // hash input password (secure to handle here?)
        const password_hash = await argon2.hash(password, {
            type: argon2.argon2id
        });

        // Create new User in DB
        const sqlResult = await sql`
        INSERT INTO "user"(first_name, last_name, username, email, password_hash, role)
        VALUES (${first_name}, ${last_name}, ${username}, ${email}, ${password_hash}, ${role})
        RETURNING *`
        console.log(sqlResult)
        const user_data = sqlResult[0]

        // Return response
        return res.status(201).json({
            success: true,
            message: "User created",
            data: user_data
        })
    
    } catch (error) {
        console.log("Error, failed to create user")
        res.status(500).json({
            success: false,
            message:`Internal Server Error: ${error}`,
            data: null
        })
    }
}

async function deleteUserByID(req, res) {
    try {
        // Parse request
        const {userID} = req.params
        if (!userID) {
            return res.status(400).json({message:"user ID requried to delete user"})
        }
        else if (!Number.isInteger(Number(userID))) {
            return res.status(400).json({message:"user ID must be an Integer to delete user"})
        }

        // delete User from DB
        const sqlResult = await sql`
        DELETE FROM "user" WHERE id = ${userID}
        RETURNING *`
        console.log(sqlResult)

        // check if user deleted
        if (sqlResult.length < 1) {
            res.status(404).json({
                success: false,
                message:"User could not be found",
                data: null
            })
        }

        //Return response
        const user_data = sqlResult[0]
        res.status(200).json({
            success: true,
            message: "User deleted",
            data: user_data
        })


    } catch (error) {
        console.log("Error, failed to get User")
        res.status(500).json({
            success: false,
            message:`Internal Server Error: ${error}`,
            data: null
        })
    }
}

export {
    getUserByID,
    addUser,
    deleteUserByID
}