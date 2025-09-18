import prisma from "../shared/prisma";
import bcryptjs from "bcryptjs";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../helpers/jwtHelpers";
import crypto from "crypto";
import { publishEmail } from "../rabitmq/publisher";

const refreshToken = async (token: string) => {
	// verify refresh token
	const payload = verifyRefreshToken(token);
	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		include: { role: true },
	});
	if (!user) throw new Error("User not found");

	const newAccessToken = generateAccessToken({
		userId: user.id,
		userEmail: user.email,
		roles: [user.role.name],
	});
	const newRefreshToken = generateRefreshToken({
		userId: user.id,
		userEmail: user.email,
		roles: [user.role.name],
	});

	return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const forgotPassword = async (email: string) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return;

	const token = crypto.randomBytes(32).toString("hex");

	await prisma.user.update({
		where: { id: user.id },
		data: {
			reset_password_token: token,
			reset_password_expiry: new Date(Date.now() + 3600_000),
		}, // 1 hour expiry
	});

	await publishEmail({
		to: user.email,
		template: "forgotPassword",
		data: { name: user.name, token },
	});
};

const resetPassword = async (token: string, newPassword: string) => {
	const user = await prisma.user.findFirst({
		where: {
			reset_password_token: token,
			reset_password_expiry: { gt: new Date() },
		},
	});

	if (!user) throw new Error("Invalid or expired token");

	const password_hash = await bcryptjs.hash(newPassword, 10);

	await prisma.user.update({
		where: { id: user.id },
		data: {
			password_hash,
			reset_password_token: null,
			reset_password_expiry: null,
		},
	});
};

export const AuthService = {
	refreshToken,
	forgotPassword,
	resetPassword,
};
