import { getChannel } from "../config/rabbitmq";
import { UserService } from "../services/user.service";

export const startUserConsumer = async () => {
	const channel = getChannel();
	const queue = "user.create";

	await channel.assertExchange("user_exchange", "direct", { durable: true });
	await channel.assertQueue(queue, { durable: true });
	await channel.bindQueue(queue, "user_exchange", "user.create");

	console.log("📥 Auth-service listening for user.create events...");

	channel.consume(queue, async (msg) => {
		if (!msg) return;

		const data = JSON.parse(msg.content.toString());

		if (!data.email || !data.password || !data.name || !data.role) {
			console.error("❌ Missing required user fields", data);
			return channel.ack(msg); // skip invalid message
		}

		try {
			await UserService.createUser(data); // hashes password, assigns role_id
			console.log("✅ User created via RabbitMQ:", data.email);
			channel.ack(msg);
		} catch (err) {
			console.error("❌ Failed to create user from RabbitMQ", err);
			channel.nack(msg, false, false);
		}
	});
};
