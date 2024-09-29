import { database } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import { emailVarifyValidation, getEmailValidation, registerAuthValidation } from "../validations/auth.validation.js";
import { validate } from "../validations/validation.js";
import bcrypt from "bcrypt";

const register = async (request) => {
	const requestBody = validate(registerAuthValidation, request.body);
	const countUser = await database.user.count({
		where: {
			email: requestBody.email,
		},
	});

	if (countUser === 1) throw new ResponseError(400, "User account is exists");
	requestBody.password = await bcrypt.hash(requestBody.password, 10);
	console.log(requestBody);
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

	if (!user) throw new ResponseError(404, "User is can't to validated");
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

export default {
	register,
	emailVerify,
};
