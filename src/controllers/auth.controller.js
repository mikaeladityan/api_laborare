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

		const payload = {
			id: result.user.id,
			email: result.user.email,
			username: result.username,
			firstName: result.user.firstName,
			lastName: result.user.lastName,
			photo: result.photo,
			isLogin: result.isLogin,
			role: result.role.name,
			roleLevel: result.role.level,
		};

		const accessToken = jwt.sign(payload, process.env.SECRETE_ACCESS_TOKEN_JWT, { expiresIn: "60s" });

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

export const logoutController = async (req, res, next) => {
	try {
		await authService.logout(req);

		res.clearCookie("refreshToken");
		res.status(200).json({
			error: false,
			message: "Successfully to logout user",
		});
	} catch (error) {
		next(error);
	}
};

export const getRefreshTokenController = async (req, res, next) => {
	try {
		const result = await getRefreshToken(req.cookies.refreshToken);
		console.log(result);
	} catch (error) {
		next(error);
	}
};
