import ApiError from "../errors/ApiError";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../helpers/jwtHelpers";
import { publishEmail } from "../rabitmq/publisher";
import prisma from "../shared/prisma";
import bcryptjs from "bcryptjs";

const createUser = async (data: {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	avatar?: string;
}) => {
	const password_hash = data.password
		? await bcryptjs.hash(data.password, 10)
		: undefined;

	// find role by name
	const role = await prisma.role.findUnique({
		where: { name: data.role },
	});

	if (!role) {
		throw new ApiError(400, "Invalid role");
	}

	const user = await prisma.user.create({
		data: {
			id: data.id,
			email: data.email,
			password_hash,
			avatar_url: data.avatar,
			status: "PENDING",
			role_id: role.id,
		},
		include: { role: true },
	});

	// send activation email
	await publishEmail({
		to: user.email,
		template: "activateUser",
		data: { name: data.name, code: "1234" },
	});

	// Send welcome email
	await publishEmail({
		to: user.email,
		template: "welcome",
		data: { name: data.name },
	});

	return user;
};

const loginUser = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { role: true },
	});

	if (!user || !user.password_hash)
		throw new ApiError(401, "User not found or invalid credentials");

	const match = await bcryptjs.compare(password, user.password_hash);
	if (!match) throw new ApiError(401, "Invalid credentials");

	// now single role
	const roles = user.role.name;

	const payload = { userEmail: user.email, userId: user.id, roles };
	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken(payload);

	return { user, accessToken, refreshToken };
};

export const UserService = {
	createUser,
	loginUser,
};
