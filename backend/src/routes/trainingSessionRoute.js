import express from "express"
import {
    addTrainingSession
} from "../controllers/trainingSessionController.js"

const router = express.Router()

router.post("/", addTrainingSession)