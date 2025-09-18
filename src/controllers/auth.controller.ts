import { Request, Response } from "express";
import sendResponse from "../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../shared/catchAsync";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const tokens = await UserService.loginUser(email, password);

	const { user, accessToken, refreshToken } = tokens;

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User logged in successfully",
		data: { user, accessToken },
	});
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const { refreshToken } = req.cookies;
	if (!refreshToken) throw new Error("No refresh token provided");

	const tokens = await AuthService.refreshToken(refreshToken);

	res.cookie("refreshToken", tokens.refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Token refreshed successfully",
		data: { accessToken: tokens.accessToken },
	});
});

export const forgotPassword = catchAsync(
	async (req: Request, res: Response) => {
		const { email } = req.body;
		await AuthService.forgotPassword(email);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Password reset link sent to email",
		});
	}
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { token, newPassword } = req.body;
	await AuthService.resetPassword(token, newPassword);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password reset successfully",
	});
});

export const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("refreshToken");

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Logged out successfully",
	});
});

export const AuthController = {
	login,
	refreshToken,
	forgotPassword,
	resetPassword,
	logout,
};
