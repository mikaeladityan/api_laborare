import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";

export const web = express();

web.use(express.json());

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
