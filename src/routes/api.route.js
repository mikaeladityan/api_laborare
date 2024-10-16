import express from "express";
import {
	changeFlagCategoryController,
	createCategoryController,
	deletedCategoryController,
	findCategoryIdController,
	listActivedController,
	updateCategoryController,
} from "../controllers/category.controller.js";
import productController from "../controllers/product.controller.js";

export const apiRoute = express.Router();
apiRoute.get("/categories", listActivedController);
apiRoute.post("/categories", createCategoryController);
apiRoute.get("/categories/:categoryId", findCategoryIdController);
apiRoute.put("/categories/:categoryId", updateCategoryController);
apiRoute.patch("/categories/:categoryId", changeFlagCategoryController);
apiRoute.delete("/categories/:categoryId", deletedCategoryController);

// Products
apiRoute.post("/products", productController.createController);
apiRoute.get("/products", productController.listController);
apiRoute.get("/products/pending", productController.listPendingController);
apiRoute.post("/products/:barcode", productController.createFeatureController);
apiRoute.get("/products/:barcode", productController.detailController);
apiRoute.put("/products/:barcode", productController.updateController);
apiRoute.delete("/products/:barcode", productController.deleteController);
apiRoute.delete("/products/:barcode/feature/:id", productController.deletedFeatureController);
apiRoute.patch("/products/:barcode/active", productController.activedController);
apiRoute.patch("/products/:barcode", productController.changeFlagController);
