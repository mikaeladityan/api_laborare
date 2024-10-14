import Joi from "joi";

export const featureValidation = Joi.object({
	id: Joi.number().optional(),
	name: Joi.string().min(5).max(100).required(),
	value: Joi.string().min(1).max(100).allow("").optional(),
	description: Joi.string().max(1000).allow("").optional(),
});
export const productValidation = Joi.object({
	categoryId: Joi.number().required(),
	name: Joi.string().min(5).max(225).required(),
	price: Joi.number().required(),
	image: Joi.string().max(100).allow("").optional(),
	description: Joi.string().max(1000).allow("").optional(),
	features: Joi.array().items(featureValidation).optional(),
});

export const getProductValidation = Joi.string().max(100).required();
