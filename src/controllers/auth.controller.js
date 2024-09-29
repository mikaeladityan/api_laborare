import authService from "../services/auth.service.js";

export const registerController = async (req, res, next) => {
	try {
		const result = await authService.register(req);
		res.status(201).json({
			error: false,
			message: "Successfully to register new user",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const emailVerifyController = async (req, res, next) => {
	try {
		const result = await authService.emailVerify(req);
		res.status(201).json({
			error: false,
			message: "Verify email is successfully",
			data: result[2],
		});
	} catch (error) {
		next(error);
	}
};
