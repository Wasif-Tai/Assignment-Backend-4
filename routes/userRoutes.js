import { Router } from "express";
import { createUser } from "../controllers/userController.js";

const userRoutes = Router();

// Expose the user creation endpoint without adding other user operations.
userRoutes.post("/", createUser);

export default userRoutes;
