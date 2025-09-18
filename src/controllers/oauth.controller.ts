import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import config from "../config";

const oauthSuccess = catchAsync(async (req: Request, res: Response) => {
	// user, accessToken, refreshToken are attached in oauth.service
	const { user, accessToken, refreshToken } = req.user as any;

	// set refresh token in httpOnly cookie
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	const { password_hash, ...safeUser } = user;

	const redirectUrl = new URL(`${config.front_end_url}/oauth/success`);
	redirectUrl.searchParams.append("accessToken", accessToken);

	res.redirect(redirectUrl.toString());
});

const oauthFailure = catchAsync(async (_req: Request, res: Response) => {
	const redirectUrl = new URL(`${config.front_end_url}/oauth/failure`);
	res.redirect(redirectUrl.toString());
});

export const OAuthController = {
	oauthSuccess,
	oauthFailure,
};
