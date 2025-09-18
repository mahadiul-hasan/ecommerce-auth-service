import jwt from "jsonwebtoken";
import config from "../config";

// Helper function to convert time string to seconds
const timeStringToSeconds = (timeString: string): number => {
	const units: { [key: string]: number } = {
		s: 1, // seconds
		m: 60, // minutes
		h: 3600, // hours
		d: 86400, // days
	};

	const match = timeString.match(/^(\d+)([smhd])$/);
	if (match) {
		const value = parseInt(match[1], 10);
		const unit = match[2];
		return value * units[unit];
	}

	// If it's just a number, assume it's seconds
	const numericValue = parseInt(timeString, 10);
	if (!isNaN(numericValue)) {
		return numericValue;
	}

	// Default fallback: 15 minutes
	return 15 * 60;
};

export const generateAccessToken = (payload: Record<string, any>): string => {
	const expiresIn = timeStringToSeconds(
		config.jwt.access_token_expires_in as string
	);
	const options: jwt.SignOptions = {
		expiresIn,
	};

	return jwt.sign(payload, config.jwt.access_token_secret as string, options);
};

export const verifyAccessToken = (token: string): any => {
	try {
		const decoded = jwt.verify(
			token,
			config.jwt.access_token_secret as string
		);

		if (
			typeof decoded === "object" &&
			decoded !== null &&
			"userId" in decoded
		) {
			return decoded as any;
		}

		throw new Error("Invalid token structure");
	} catch (error) {
		throw new Error("Invalid or expired token");
	}
};

export const generateRefreshToken = (payload: Record<string, any>): string => {
	const expiresIn = timeStringToSeconds(
		config.jwt.refresh_token_expires_in as string
	);
	const options: jwt.SignOptions = {
		expiresIn,
	};

	return jwt.sign(
		payload,
		config.jwt.refresh_token_secret as string,
		options
	);
};

export const verifyRefreshToken = (token: string): any => {
	try {
		const decoded = jwt.verify(
			token,
			config.jwt.refresh_token_secret as string
		);

		if (typeof decoded === "object" && decoded !== null) {
			return decoded as any;
		}

		throw new Error("Invalid refresh token structure");
	} catch (error) {
		throw new Error("Invalid or expired refresh token");
	}
};
