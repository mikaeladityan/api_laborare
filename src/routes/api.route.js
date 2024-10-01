import express from "express";
import {
	changeFlagCategoryController,
	createCategoryController,
	deletedCategoryController,
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
apiRoute.delete("/categories/:categoryId", deletedCategoryController);
