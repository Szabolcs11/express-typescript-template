import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidator";
import { isAlreadyLoggedIn } from "../services/isAlreadyLoggedIn";
import { isAuthenticated } from "../services/isAuthenticated";

const router = Router();

router.post("/register", isAuthenticated, validateRegisterInput, register);
router.post("/login", isAlreadyLoggedIn, validateLoginInput, login);
router.post("/logout", isAuthenticated, logout);

export default router;
