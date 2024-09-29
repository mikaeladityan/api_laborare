import Joi from "joi";

export const authValidation = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).max(100).required(),
});

export const emailVarifyValidation = Joi.string().min(10).max(100).required();
export const getEmailValidation = Joi.string().email().required();
