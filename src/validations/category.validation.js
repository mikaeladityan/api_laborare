import Joi from "joi";

export const categoryValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).lowercase().optional(),
});

export const getCategoryByIdValidation = Joi.number().required();
