import supertest from "supertest";
import { clearCategoryTest, createCategoryTest, findCategoryIdTest } from "./utils/lib.js";
import { web } from "../src/app/web.js";
import { database } from "../src/app/database.js";

describe("POST /api/v1/categories", () => {
	afterEach(async () => await clearCategoryTest());

	it("should can create new category", async () => {
		const result = await supertest(web).post("/api/v1/categories").send({
			name: "Test Categories",
		});
		expect(result.status).toBe(201);
		expect(result.body.error).toBe(false);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Test Categories");
		expect(result.body.data.slug).toBe("test-categories");
	});

	it("should can reject if category is exist", async () => {
		let result = await supertest(web).post("/api/v1/categories").send({
			name: "Test Categories",
		});
		expect(result.status).toBe(201);
		expect(result.body.error).toBe(false);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Test Categories");
		expect(result.body.data.slug).toBe("test-categories");

		result = await supertest(web).post("/api/v1/categories").send({
			name: "Test Categories",
		});
		expect(result.status).toBe(400);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});
});

describe("GET /api/v1/categories/current", () => {
	beforeEach(async () => createCategoryTest());
	afterEach(async () => clearCategoryTest());

	it("should can be find categories by id", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web).get(`/api/v1/categories/${categoryId.id}`);

		expect(result.status).toBe(200);
		expect(result.body.data.name).toBe("Category Name Test");
		expect(result.body.data.slug).toBe("category-name-test");
	});

	it("should can reject if categoryId not found", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web).get(`/api/v1/categories/${categoryId.id + 1}`);

		console.log(result.body);
		expect(result.status).toBe(404);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});
});

describe("PUT /api/v1/categories/current", () => {
	beforeEach(async () => {
		await createCategoryTest();
	});

	afterEach(async () => {
		await clearCategoryTest();
	});

	it("should can be updated category by id", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web).put(`/api/v1/categories/${categoryId.id}`).send({
			name: "Updated Category Test Name",
		});
		expect(result.status).toBe(201);
		expect(result.body.error).toBe(false);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Updated Category Test Name");
		expect(result.body.data.slug).toBe("updated-category-test-name");
	});

	it("should can reject if categoryId is not found", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web)
			.put(`/api/v1/categories/${categoryId.id + 1}`)
			.send({
				name: "Updated Category Test Name",
			});
		expect(result.status).toBe(404);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});

	it("should can reject if category is exist", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web).put(`/api/v1/categories/${categoryId.id}`).send({
			name: "Category Name Test",
		});

		expect(result.status).toBe(400);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});
});

describe("PATCH /api/v1/categories/current", () => {
	beforeEach(async () => {
		await createCategoryTest();
	});

	afterEach(async () => {
		await clearCategoryTest();
	});

	it("should can be change Flag Category", async () => {
		const categoryId = await findCategoryIdTest();
		let result = await supertest(web).patch(`/api/v1/categories/${categoryId.id}`);

		// Disabled Category
		console.log(result.status);
		console.log("DISABLED: " + result.body.message);
		expect(result.status).toBe(201);
		expect(result.body.error).toBe(false);

		// Activated Category
		result = await supertest(web).patch(`/api/v1/categories/${categoryId.id}`);
		console.log("ACTIVED: " + result.body.message);
		expect(result.status).toBe(201);
		expect(result.body.error).toBe(false);
	});

	it("should can reject if categoryId is not found", async () => {
		const categoryId = await findCategoryIdTest();
		const result = await supertest(web).patch(`/api/v1/categories/${categoryId.id + 1}`);
		expect(result.status).toBe(404);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});
});

describe("GET /categories", () => {
	beforeEach(async () => {
		await database.category.deleteMany({});
		const dummyCategories = Array.from({ length: 25 }, (_, index) => ({
			name: `Category Name ${index + 1}`,
			slug: `category-name-${index + 1}`,
		}));
		await database.category.createMany({ data: dummyCategories });
	});
	afterAll(async () => {
		await clearCategoryTest();
	});

	it("should return a list of categories", async () => {
		const response = await supertest(web).get("/api/v1/categories");
		console.log(response.body);
		expect(response.status).toBe(200);
		// expect(totalBody).toHaveLength(25);
	});
});
