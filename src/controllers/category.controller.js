import { create, deleted, findById, listActived, update, updateFlag } from "../services/category.service.js";

export const createCategoryController = async (req, res, next) => {
	try {
		const result = await create(req.body);
		res.status(201).json({
			error: false,
			message: "Successfully to created a new category",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const findCategoryIdController = async (req, res, next) => {
	try {
		const result = await findById(req.params.categoryId);
		res.status(200).json({
			error: false,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const updateCategoryController = async (req, res, next) => {
	try {
		const categoryId = req.params.categoryId;
		const request = req.body;
		const result = await update(categoryId, request);

		res.status(201).json({
			error: false,
			message: "Successfully updated a category",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const changeFlagCategoryController = async (req, res, next) => {
	try {
		const result = await updateFlag(req.params.categoryId);

		res.status(201).json({
			error: false,
			message: `Category "${result.name}" successfully to ${result.flag}`,
		});
	} catch (error) {
		next(error);
	}
};

export const deletedCategoryController = async (req, res, next) => {
	try {
		const result = await deleted(req.params.categoryId);

		res.status(201).json({
			error: false,
			message: `Category "${result.name}" successfully to ${result.flag}`,
		});
	} catch (error) {
		next(error);
	}
};

export const listActivedController = async (req, res, next) => {
	try {
		const page = 1;
		const limit = 10;
		const result = await listActived(page, limit);
		console.log(result);
		res.status(200).json({
			error: false,
			message: "Successfully to get list Category Actived",
			data: result,
			page: page,
			limit: limit,
		});
	} catch (error) {
		next(error);
	}
};
