import slug from "slug";
import { getProductValidation, productValidation } from "../validations/product.validation.js";
import { validate } from "../validations/validation.js";
import { database } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

const create = async (request) => {
	const product = validate(productValidation, request);

	const countProduct = await database.product.count({
		where: {
			slug: slug(product.name),
		},
	});

	if (countProduct > 0) {
		throw new ResponseError(400, "Product is already created.");
	}

	// Check category
	const productCategory = await database.category.findUnique({
		where: {
			id: product.categoryId,
			flag: "ACTIVED",
		},
	});
	if (!productCategory) throw new ResponseError(404, "Category is not found.");

	const result = database.$transaction(async (tx) => {
		const dataProduct = await tx.product.create({
			data: {
				name: product.name,
				price: product.price,
				slug: slug(product.name),
				categoryId: product.categoryId,
				username: "ADMIN",
				description: product.description,
				image: product.image,
			},
			select: {
				barcode: true,
				name: true,
				category: {
					select: {
						name: true,
					},
				},
				slug: true,
				description: true,
			},
		});

		const features = await tx.feature.createMany({
			data: (product.features || []).map((feature) => ({
				barcode: dataProduct.barcode,
				name: feature.name,
				value: feature.value,
				description: feature.description,
			})),
			skipDuplicates: true,
		});

		return { product: dataProduct, features };
	});

	return result;
};

const findByBarcode = async (barcode) => {
	validationProduct(barcode);

	const result = await database.product.findFirst({
		where: {
			barcode: barcode,
			flag: "ACTIVED",
		},
		select: {
			barcode: true,
			slug: true,
			name: true,
			price: true,
			description: true,
			createdAt: true,
			updatedAt: true,
			image: true,
			account: {
				select: {
					username: true,
				},
			},
			features: {
				select: {
					name: true,
					value: true,
					description: true,
				},
			},
			category: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!result) throw new ResponseError(404, "Products is not found");
	return result;
};

const list = async () => {
	const result = await database.product.findMany({
		where: {
			flag: "ACTIVED",
		},
		select: {
			name: true,
			barcode: true,
			category: {
				select: {
					name: true,
				},
			},
			flag: true,
			price: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	if (result.length === 0) throw new ResponseError(400, "Products is empty");
	return result;
};
const listPending = async () => {
	const result = await database.product.findMany({
		where: {
			flag: "PENDING",
		},
		select: {
			name: true,
			barcode: true,
			category: {
				select: {
					name: true,
				},
			},
			flag: true,
			price: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	if (result.length === 0) throw new ResponseError(400, "Products pending is empty");
	return result;
};

const deleted = async (barcode) => {
	validationProduct(barcode);

	const result = await database.$transaction([
		database.feature.deleteMany({
			where: {
				barcode: barcode,
			},
		}),
		database.product.delete({
			where: {
				barcode: barcode,
			},
		}),
	]);

	if (!result) throw new ResponseError(404, "Products is not found");
};

const actived = async (barcode) => {
	validationProduct(barcode);

	const product = await getProducts(barcode);

	if (!product) throw new ResponseError(404, "Product is not found");

	if (product.flag !== "PENDING") throw new ResponseError(400, "Products is already active");

	return await database.product.update({
		where: {
			barcode: product.barcode,
			flag: "PENDING",
		},
		data: {
			flag: "ACTIVED",
		},
		select: {
			name: true,
			flag: true,
		},
	});
};

const changeFlag = async (barcode) => {
	validationProduct(barcode);

	const product = await getProducts(barcode);
	if (!product) throw new ResponseError(404, "Product is not found");

	if (product.flag === "ACTIVED") {
		product.flag = "DISABLED";
	} else if (product.flag === "DISABLED") {
		product.flag = "ACTIVED";
	} else {
		throw new ResponseError(400, "Products is pending, please actived first!");
	}

	return await database.product.update({
		where: {
			barcode: product.barcode,
		},
		data: product,
	});
};
const getProducts = (barcode) => {
	const result = database.product.findUnique({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			flag: true,
		},
	});

	return result;
};
const validationProduct = (barcode) => {
	return validate(getProductValidation, barcode);
};
export default { create, findByBarcode, list, deleted, actived, changeFlag, listPending };
