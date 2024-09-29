import authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

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

export const resendEmailVerifyController = async (req, res, next) => {
	try {
		const result = await authService.resendEmailVerify(req);
		res.status(201).json({
			error: false,
			message: "Successfully to resend email verify",
			data: result[2],
		});
	} catch (error) {
		next(error);
	}
};

export const loginController = async (req, res, next) => {
	try {
		const result = await authService.login(req.body);

		const id = result.user.id;
		const email = result.user.email;
		const username = result.username;
		const firstName = result.user.firstName;
		const lastName = result.user.lastName;
		const photo = result.photo;
		const isLogin = result.isLogin;
		const role = result.role.name;
		const roleLevel = result.role.level;

		const accessToken = jwt.sign(
			{
				id,
				email,
				username,
				firstName,
				lastName,
				photo,
				isLogin,
				role,
				roleLevel,
			},
			process.env.SECRETE_ACCESS_TOKEN_JWT,
			{ expiresIn: "60s" }
		);

		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});
		res.status(200).json({
			error: false,
			message: "Successfully to login",
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};
