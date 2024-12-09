import express from "express";
import { testPostControllers } from "../controllers/testControllers.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/test-post", userAuth, testPostControllers);
export default router;
