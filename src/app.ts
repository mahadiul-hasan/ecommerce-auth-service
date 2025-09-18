import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config";
import { setupSwagger } from "./swagger";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Security middleware
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
			},
		},
		crossOriginEmbedderPolicy: false,
	})
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

setupSwagger(app);

// Routes
app.use("/api", router);
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(globalErrorHandler);

export default app;
