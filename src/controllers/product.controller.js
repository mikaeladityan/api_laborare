import productService from "../services/product.service.js";

const createController = async (req, res, next) => {
	try {
		const result = await productService.create(req.body);
		console.log(result);
		res.status(201).json({
			error: false,
			message: "Successfully to created new Products",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listController = async (req, res, next) => {
	try {
		const result = await productService.list();
		res.status(200).json({
			error: false,
			message: "Successfully to get products",
			total: result.length,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listPendingController = async (req, res, next) => {
	try {
		const result = await productService.listPending();
		res.status(200).json({
			error: false,
			message: "Successfully to get products",
			total: result.length,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const detailController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const result = await productService.findByBarcode(barcode);
		res.status(200).json({
			error: false,
			message: `Successfully to get data product ${result.name}`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const deleteController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		await productService.deleted(barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to deleted product`,
		});
	} catch (error) {
		next(error);
	}
};

const activedController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const result = await productService.actived(barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to ${result.flag} the ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const changeFlagController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const result = await productService.changeFlag(barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to ${result.flag} the ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	listController,
	listPendingController,
	detailController,
	deleteController,
	activedController,
	changeFlagController,
};
