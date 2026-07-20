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

async function getNextTrainingSessionForTrainer(req, res) {
    try {
        // parse request
        const {trainerID} = req.params;
        if (!trainerID) {
            return res.status(400).json({
                success: false,
                message:"Trainer ID required to get next Training Session for Trainer",
                data: null
            })
        }

        // get next Training Session for Trainer
        const sqlResult = await sql`
        SELECT id, title, description, start_time, end_time, trainer_id
        FROM trainingSession
        WHERE 
            trainer_id = ${trainerID} 
            AND start_time > NOW()
            AND is_deleted = FALSE
        ORDER BY start_time ASC
        LIMIT 1`
        console.log(sqlResult)

        // check if next Training Session for Trainer found
        if (sqlResult.length < 1) {
            res.status(404).json({
                success: false,
                message: "Next Training Session could not be found for Trainer",
                data: null
            })
        }
        // else Next Training Session was found for Trainer

        // return response
        const nextTrainingSession_data = sqlResult[0]
        return res.status(200).json({
            success: true,
            message: "",
            data: nextTrainingSession_data
        })
    
    } catch (error) {
        console.log("Error, failed to get Next Training Session for Trainer")
        res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error}`,
            data: null
        })
    }
}

async function getAllTraininingSessionsForTrainer(req, res) {
    try {    
        // parse request
        const {trainerID} = req.params
        if (!trainerID) {
            return res.status(400).json({
                success: false,
                message:"Trainer ID required to get next Training Session for Trainer",
                data: null
            })
        }

        // get all Training Sessions for Trainer
        const sqlResult = await sql`
        SELECT *
        FROM trainingSession
        WHERE 
            trainer_id = ${trainerID}
            AND is_deleted = FALSE
        ORDER BY start_time ASC`

        // check if Training Sessions found for Trainer
        if (sqlResult.length < 1) {
            res.status(404).json({
                success: false,
                message: "No Training Sessions could not be found for Trainer",
                data: null
            })
        }

        // return response
        const trainingSessions_data = sqlResult
        return res.status(200).json({
            success: true,
            message: "",
            data: trainingSessions_data
        })

    } catch (error) {
        console.log("Error, failed to get Training Sessions for Trainer")
        res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error}`,
            data: null
        })
    }
}

export {
    addTrainingSession,
    getNextTrainingSessionForTrainer,
    getAllTraininingSessionsForTrainer
}