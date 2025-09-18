import express from "express";
import { AuthRoute } from "./auth.routes";
import { OAuthRoute } from "./oauth.routes";

const router = express.Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: AuthRoute,
	},
	{
		path: "/oauth",
		route: OAuthRoute,
	},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
