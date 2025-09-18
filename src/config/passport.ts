import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./index";
import { OAuthService } from "../services/oauth.service";

passport.use(
	new GoogleStrategy(
		{
			clientID: config.google.client_id!,
			clientSecret: config.google.client_secret!,
			callbackURL: config.google.redirect_uri!,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			done: Function
		) => {
			try {
				const user = await OAuthService.createOrLoginOAuthUser(profile);
				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);

passport.serializeUser((user: any, done: Function) => {
	done(null, user.id);
});

passport.deserializeUser((id: string, done: Function) => {
	// Optional: fetch user from DB if needed
	done(null, id);
});

export default passport;
