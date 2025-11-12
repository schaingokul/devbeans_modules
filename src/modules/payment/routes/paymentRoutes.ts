import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { authorizeRoles } from "../../../middleware/rbacMiddleware";

import * as paymentController from "../controller/paymentController";

const router = Router();

router.post('/')
router.get('/')
router.get('/:paymentId')
router.put('/:paymentId')
router.delete('/:paymentId')
router.get('/summary')
router.post('/queue')

export default router;
