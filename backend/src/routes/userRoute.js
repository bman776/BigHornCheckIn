import express from "express"
import {
    getUserByID,
    addUser,
    deleteUserByID
} from "../controllers/userController.js"

const router = express.Router()

router.get("/:userID", getUserByID)

router.post("/", addUser)

router.delete("/:userID", )

export default router