import express from "express";
import { emailVerifyController, registerController } from "../controllers/auth.controller.js";

export const appRouter = express.Router();

// Authentication
appRouter.post("/register", registerController);
appRouter.post("/register/:email/email-verify", emailVerifyController);
