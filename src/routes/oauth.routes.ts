import express from "express";
import passport from "passport";
import { OAuthController } from "../controllers/oauth.controller";

const router = express.Router();

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/oauth/failure",
		session: false,
	}),
	OAuthController.oauthSuccess
);
router.get("/success", OAuthController.oauthSuccess);
router.get("/failure", OAuthController.oauthFailure);

export const OAuthRoute = router;
