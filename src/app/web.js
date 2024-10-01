import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { apiRoute } from "../routes/api.route.js";
import { appRouter } from "../routes/app.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const web = express();

web.use(cors({ credentials: true, origin: "http://localhost:3000" }));
web.use(cookieParser());
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.use("/api/v1", apiRoute);
web.use("/api/v1", appRouter);
web.use("/api/health", (req, res) => {
	res.status(200).json({
		error: false,
		message: "Server health is Running OK",
		data: {
			database: "Connected",
			server: "Connected",
		},
	});
});
web.use((req, res) => {
	res.status(404).json({
		error: true,
		message: "Page is not found",
	});
});

// Middleware
web.use(errorMiddleware);
