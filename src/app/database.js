import { PrismaClient } from "@prisma/client";
import { errLogger, logger } from "./logging.js";

export const database = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "warn",
		},
	],
});

database.$on("query", (e) => {
	console.log("Query: " + e.query);
	console.log("Params: " + e.params);
	console.log("Duration: " + e.duration + "ms");
});
database.$on("error", (e) => {
	errLogger.error(`${e.target}, message: ${e.target},  ${e.timestamp}`);
});

database.$on("info", (e) => logger.info(e));
database.$on("error", (e) => logger.error(e));
database.$on("warn", (e) => logger.warn(e));
