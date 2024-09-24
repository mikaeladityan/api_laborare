import dotenv from "dotenv";
import { web } from "./app/web.js";
import { logger } from "./app/logging.js";
dotenv.config();

const port = process.env.APP_PORT || 3000;
web.listen(port, () => {
	logger.info(`Server is running on: http://localhost:${port}`);
});
