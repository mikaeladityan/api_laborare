import winston from "winston";

export const logger = new winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [new winston.transports.Console({})],
});

export const errLogger = new winston.createLogger({
	level: "error",
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: "./log/error.log", level: "error" }),
		new winston.transports.Console({}),
	],
});
