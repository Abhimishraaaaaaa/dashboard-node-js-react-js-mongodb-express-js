import express from "express";
import { createjobController } from "../controllers/jobsControllers.js";
import { getalljobController } from "../controllers/jobsControllers.js";
import { updatejobController } from "../controllers/jobsControllers.js";
import { delatejobController } from "../controllers/jobsControllers.js";
import { jobstatsController } from "../controllers/jobsControllers.js";
import userAuth from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routes

// post USER
router.post("/create-job", userAuth, createjobController);
// GET USERS || GET
router.get("/get-job", userAuth, getalljobController);

// || patch
router.patch("/update-job/:id", userAuth, updatejobController);
// delate
router.delete("/delate-job/:id", userAuth, delatejobController);
// job-stats
router.get("/job-stats", userAuth, jobstatsController);

export default router;
