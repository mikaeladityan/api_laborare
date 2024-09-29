import { database } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import { emailVarifyValidation, getEmailValidation, authValidation } from "../validations/auth.validation.js";
import { validate } from "../validations/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const register = async (request) => {
	const requestBody = validate(authValidation, request.body);
	const countUser = await database.user.count({
		where: {
			email: requestBody.email,
		},
	});

	if (countUser === 1) throw new ResponseError(400, "User account is exists");
	const saltBcrypt = await bcrypt.genSalt();
	requestBody.password = await bcrypt.hash(requestBody.password, saltBcrypt);
	return await database.user.create({
		data: {
			email: requestBody.email,
			password: requestBody.password,
			email_verify: {
				create: {
					ip: request.ip,
					userAgent: request.headers["user-agent"],
				},
			},
		},
		select: {
			email: true,
			flag: true,
			createdAt: true,
			updatedAt: true,
			email_verify: {
				select: {
					token: true,
					ip: true,
					userAgent: true,
					createdAt: true,
					expiredAt: true,
				},
			},
		},
	});
};

const emailVerify = async (request) => {
	const email = validate(getEmailValidation, request.params.email);
	const token = validate(emailVarifyValidation, request.body.token);

	const verify = await database.emailVerify.findUnique({
		where: {
			email: email,
		},
	});

	if (!verify) throw new ResponseError(404, "Email not found");
	if (!verify.ip === request.ip) throw new ResponseError(400, "");
	if (!verify.userAgent === request.headers["user-agent"]) throw new ResponseError(400, "");

	const currentTime = new Date().toString();
	const expTime = verify.expiredAt.toISOString();
	if (verify.token === token) {
		if (currentTime.split(" ")[4] > expTime.split("T")[1].slice(0, -1))
			throw new ResponseError(400, "Validate is expired");
	} else {
		throw new ResponseError(400, "Wrong validating email verify");
	}

	const user = await database.user.findUnique({
		where: {
			email: verify.email,
			flag: "PENDING",
		},
	});

	if (!user) throw new ResponseError(404, "User has verified or not exist");
	const tx = await database.$transaction(
		[
			database.user.update({
				where: { email: user.email },
				data: {
					flag: "ACTIVED",
				},
				select: {
					id: true,
				},
			}),
			database.account.create({
				data: {
					email: verify.email,
					roleId: 1,
					ip: request.ip,
					userAgent: request.headers["user-agent"],
				},
				select: {
					roleId: true,
				},
			}),
			database.user.findUnique({
				where: {
					email: user.email,
				},
				select: {
					email: true,
					flag: true,
					account: {
						select: {
							isLogin: true,
							ip: true,
							userAgent: true,
							role: {
								select: {
									name: true,
									level: true,
								},
							},
						},
					},
				},
			}),
		],
		{
			isolationLevel: "Serializable",
			maxWait: 5000, // default: 2000
			timeout: 10000, // default: 5000
		}
	);
	return tx;
};

const resendEmailVerify = async (request) => {
	const email = validate(getEmailValidation, request.params.email);
	const findEmail = await database.user.findUnique({
		where: {
			email: email,
			flag: "PENDING",
		},
		select: { email: true },
	});

	if (!findEmail) throw new ResponseError(404, "Email has verified or not exist");

	const tx = await database.$transaction(
		[
			database.emailVerify.delete({
				where: { email: findEmail.email },
			}),
			database.emailVerify.create({
				data: {
					email: findEmail.email,
					ip: request.ip,
					userAgent: request.headers["user-agent"],
				},
			}),

			database.user.findUnique({
				where: {
					email: findEmail.email,
				},
				select: {
					email: true,
					flag: true,
					createdAt: true,
					updatedAt: true,
					email_verify: {
						select: {
							token: true,
							ip: true,
							userAgent: true,
							createdAt: true,
							expiredAt: true,
						},
					},
				},
			}),
		],
		{
			isolationLevel: "Serializable",
			maxWait: 5000, // default: 2000
			timeout: 10000, // default: 5000
		}
	);

	return tx;
};

const login = async (request) => {
	const requestBody = validate(authValidation, request);
	const findUser = await database.user.findUnique({
		where: { email: requestBody.email, flag: "ACTIVED" },
		select: { email: true, flag: true, password: true },
	});

	if (!findUser) throw new ResponseError(404, "User is not found");
	const findAccount = await database.account.findUnique({
		where: {
			email: findUser.email,
			isLogin: "LOGOUT",
		},
		select: {
			isLogin: true,
			photo: true,
			username: true,
			ip: true,
			userAgent: true,
			user: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					password: true,
				},
			},
			role: {
				select: {
					name: true,
					level: true,
				},
			},
		},
	});

	if (!findAccount) throw new ResponseError(400, "Email or Password is wrong or already to login");

	const reqPassword = findUser.password;
	const matchPassword = await bcrypt.compare(requestBody.password, reqPassword);
	if (!matchPassword) throw new ResponseError(400, "Email or Password is wrong");

	// Constructuring
	const id = findAccount.user.id;
	const email = findAccount.user.email;
	const username = findAccount.username;
	const firstName = findAccount.user.firstName;
	const lastName = findAccount.user.lastName;
	const photo = findAccount.photo;
	const isLogin = findAccount.isLogin;
	const role = findAccount.role.name;
	const roleLevel = findAccount.role.level;

	const refreshToken = jwt.sign(
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
		process.env.SECRETE_REFRESH_TOKEN_JWT,
		{ expiresIn: "30d" }
	);

	return await database.account.update({
		where: {
			email: findAccount.user.email,
			isLogin: "LOGOUT",
			user: {
				flag: "ACTIVED",
			},
		},
		data: {
			isLogin: "LOGIN",
			refreshToken: refreshToken,
		},
		select: {
			isLogin: true,
			photo: true,
			username: true,
			ip: true,
			userAgent: true,
			refreshToken: true,
			user: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					password: true,
				},
			},
			role: {
				select: {
					name: true,
					level: true,
				},
			},
		},
	});
};

export default {
	register,
	emailVerify,
	resendEmailVerify,
	login,
};
