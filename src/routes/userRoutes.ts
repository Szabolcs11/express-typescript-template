import { Router } from "express";
import { getUsers, getUserById, editUser } from "../controllers/userController";

const router = Router({ mergeParams: true });

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/edit", editUser);

export default router;
