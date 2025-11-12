import userRoutes from "./routes/userRoutes";
import { Router } from "express";

const router = Router();

router.use("/users", userRoutes);

export default router;