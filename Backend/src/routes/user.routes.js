import { Router } from "express";
import { login, register, addToHistory, getUserHistory, forgotPassword, resetPassword, googleLogin} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/google-login").post(googleLogin);

export default router;
