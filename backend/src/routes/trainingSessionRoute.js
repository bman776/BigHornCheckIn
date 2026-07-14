import express from "express"
import {
    addTrainingSession,
    getNextTrainingSessionForTrainer,
    getAllTraininingSessionsForTrainer
} from "../controllers/trainingSessionController.js"

const router = express.Router()

router.post("/", addTrainingSession)

router.get("/nextTrainingSessionForTrainer/:trainerID", getNextTrainingSessionForTrainer)

router.get("/allTrainingSessionsForTrainer/:trainerID", getAllTraininingSessionsForTrainer)

router.delete("/")

export default router