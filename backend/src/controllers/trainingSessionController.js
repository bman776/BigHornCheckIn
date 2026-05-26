import { sql } from "../config/db.js"

async function addTrainingSession(req, res) {
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
}

export {
    addTrainingSession
}