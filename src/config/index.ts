/* eslint-disable no-undef */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	front_end_url: process.env.FRONT_END_URL,
	rabbitmq: {
		url: process.env.RABBITMQ_URL,
	},
	jwt: {
		access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
		refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
		access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
		refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		db: process.env.REDIS_DB,
	},
	google: {
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI,
	},
};
