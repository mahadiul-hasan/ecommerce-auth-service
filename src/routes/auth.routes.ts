import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/logout", AuthController.logout);

export const AuthRoute = router;
