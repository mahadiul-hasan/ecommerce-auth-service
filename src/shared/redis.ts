import config from "../config";

const redisConfig = {
	host: config.redis.host,
	port: config.redis.port,
	password: config.redis.password,
	db: config.redis.db,
	maxRetriesPerRequest: null,
	enableReadyCheck: false,
};

export default redisConfig;
