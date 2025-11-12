import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { authorizeRoles } from "../../../middleware/rbacMiddleware";
import * as userController from "../controller/userController";

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', authMiddleware, authorizeRoles('users', 'admin'), userController.getUserById);
router.put('/:id', authMiddleware, authorizeRoles('users', 'admin'), userController.updateUserById);
router.get('/' , authMiddleware, authorizeRoles('admin'), userController.listUsers);
router.put('/:id', authMiddleware, authorizeRoles('users', 'admin'), userController.softDeleteUserById);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), userController.hardDeleteUserById);
router.post('/logout');

export default router;
