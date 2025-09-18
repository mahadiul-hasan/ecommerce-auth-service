import { getChannel } from "../config/rabbitmq";

export interface EmailJob {
	to: string;
	template: string;
	data: Record<string, any>;
}

export const publishEmail = async (job: EmailJob) => {
	const channel = getChannel();

	channel.publish(
		"email_exchange",
		"send_email",
		Buffer.from(JSON.stringify(job)),
		{
			priority: 2,
			headers: { "x-retries": 0 },
		}
	);

	console.log(`📨 Email job published → ${job.template} → ${job.to}`);
};
