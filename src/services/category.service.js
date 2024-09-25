import { validate } from "../validations/validation.js";
import { categoryValidation, getCategoryByIdValidation } from "../validations/category.validation.js";
import slug from "slug";
import { database } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

export const create = async (request) => {
	const category = validate(categoryValidation, request);
	if (category.slug === undefined) category.slug = slug(category.name);

	const countCategory = await database.category.count({
		where: {
			slug: category.slug,
		},
	});
	if (countCategory >= 1) throw new ResponseError(400, "Category is exist");

	return await database.category.create({
		data: category,
		select: {
			name: true,
			slug: true,
		},
	});
};

export const findById = async (categoryId) => {
	categoryId = validate(getCategoryByIdValidation, categoryId);

	const data = await database.category.findUnique({
		where: { id: categoryId, flag: "ACTIVED" },
		select: {
			name: true,
			slug: true,
		},
	});

	if (!data) throw new ResponseError(404, "Category is not found");
	return data;
};

export const update = async (categoryId, request) => {
	categoryId = validate(getCategoryByIdValidation, categoryId);
	const id = await database.category.findUnique({
		where: {
			id: categoryId,
			flag: "ACTIVED",
		},
		select: {
			id: true,
		},
	});
	if (!id) throw new ResponseError(404, "Category is not found");

	const category = validate(categoryValidation, request);
	if (category.slug === undefined) category.slug = slug(category.name);
	const countCategory = await database.category.count({
		where: {
			slug: category.slug,
		},
	});
	if (countCategory >= 1) throw new ResponseError(400, "Category is exist");

	return await database.category.update({
		data: category,
		where: { id: categoryId },
		select: {
			name: true,
			slug: true,
		},
	});
};

export const updateFlag = async (categoryId) => {
	categoryId = validate(getCategoryByIdValidation, categoryId);

	const findId = await database.category.findUnique({
		where: { id: categoryId },
		select: { id: true, flag: true },
	});

	if (!findId) throw new ResponseError(404, "Category is not found");
	if (findId.flag == "ACTIVED") {
		findId.flag = "DISABLED";
	} else {
		findId.flag = "ACTIVED";
	}

	return await database.category.update({
		where: { id: findId.id },
		data: findId,
		select: {
			name: true,
			flag: true,
		},
	});
};

export const listActived = async () => {
	const page = 1;
	const limit = 10;
	return await database.category.findMany({
		where: {
			flag: "ACTIVED",
		},
		select: {
			id: true,
			name: true,
			slug: true,
		},
		skip: (page - 1) * limit,
		take: limit,
		orderBy: {
			id: "asc",
		},
	});
};
