import slug from "slug";
import { database } from "../../src/app/database.js";

export const clearCategoryTest = async () => {
	await database.category.deleteMany();
};

export const createCategoryTest = async () => {
	const name = "Category Name Test";
	await database.category.create({
		data: {
			name: name,
			slug: slug(name),
		},
		select: {
			id: true,
			name: true,
			slug: true,
			flag: true,
		},
	});
};

export const findCategoryIdTest = async () => {
	return database.category.findFirst({
		where: {
			slug: "category-name-test",
		},
	});
};
