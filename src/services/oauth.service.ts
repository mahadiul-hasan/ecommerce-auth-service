import ApiError from "../errors/ApiError";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../helpers/jwtHelpers";
import { publishEmail } from "../rabitmq/publisher";
import { publishCustomerCreate } from "../rabitmq/user.publisher";
import prisma from "../shared/prisma";

const createOrLoginOAuthUser = async (profile: any) => {
	const email = profile.emails[0].value;
	let user = await prisma.user.findUnique({
		where: { email },
		include: { role: true },
	});

	if (!user) {
		const customerRole = await prisma.role.findUnique({
			where: { name: "customer" },
		});

		if (!customerRole) {
			throw new ApiError(500, "Customer role not found");
		}

		user = await prisma.user.create({
			data: {
				email,
				avatar_url: profile.photos[0].value,
				provider: "google",
				provider_id: profile.id,
				status: "ACTIVE",
				role_id: customerRole.id,
			},
			include: { role: true },
		});
	}

	await publishCustomerCreate({
		user_id: user.id,
		name: profile.displayName,
	});

	await publishEmail({
		to: user.email,
		template: "welcome",
		data: { name: profile.displayName },
	});

	const role = user.role.name;

	const payload = { userEmail: user.email, userId: user.id, role };
	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken(payload);

	return { user, accessToken, refreshToken };
};

export const OAuthService = {
	createOrLoginOAuthUser,
};
