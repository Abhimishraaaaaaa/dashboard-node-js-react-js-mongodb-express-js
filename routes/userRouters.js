import express from "express";
import { updateUserController } from "../controllers/userControllers.js";
import { getUserController } from "../controllers/userControllers.js";
import userAuth from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();


//routes

// GET USERS || GET

router.post("/getUser", userAuth, getUserController);

// UPDATE USER || PUT

router.put("/update-user", userAuth, updateUserController);

export default router;


