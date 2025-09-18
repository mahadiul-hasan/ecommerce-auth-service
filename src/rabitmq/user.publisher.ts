import { getChannel } from "../config/rabbitmq";

export interface CustomerCreatedJob {
	user_id: string;
	name: string;
}

export const publishCustomerCreate = async (job: CustomerCreatedJob) => {
	const channel = getChannel();

	channel.publish(
		"user_exchange",
		"customer.create",
		Buffer.from(JSON.stringify(job)),
		{ persistent: true }
	);

	console.log(`📤 Published customer.create event → user_id: ${job.user_id}`);
};
