import express from "express";
import {
	changeFlagCategoryController,
	createCategoryController,
	findCategoryIdController,
	listActivedController,
	updateCategoryController,
} from "../controllers/category.controller.js";

export const apiRoute = express.Router();
apiRoute.get("/categories", listActivedController);
apiRoute.post("/categories", createCategoryController);
apiRoute.get("/categories/:categoryId", findCategoryIdController);
apiRoute.put("/categories/:categoryId", updateCategoryController);
apiRoute.patch("/categories/:categoryId", changeFlagCategoryController);
