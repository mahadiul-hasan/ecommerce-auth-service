import amqp from "amqplib";
import config from "./index";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
	const connection = await amqp.connect(config.rabbitmq.url as string);
	channel = await connection.createChannel();

	// Exchanges
	await channel.assertExchange("email_exchange", "direct", { durable: true });
	await channel.assertExchange("user_exchange", "direct", { durable: true });

	return channel;
};

export const getChannel = () => {
	if (!channel) throw new Error("RabbitMQ channel not initialized");
	return channel;
};
