import express from "express";
import {
	emailVerifyController,
	loginController,
	registerController,
	resendEmailVerifyController,
	logoutController,
	getRefreshTokenController,
} from "../controllers/auth.controller.js";

export const appRouter = express.Router();

// Authentication
appRouter.post("/register", registerController);
appRouter.post("/register/:email/email-verify", emailVerifyController);
appRouter.put("/register/:email/email-verify", resendEmailVerifyController);
appRouter.post("/login", loginController);
appRouter.delete("/logout", logoutController);
appRouter.get("/token", getRefreshTokenController);
