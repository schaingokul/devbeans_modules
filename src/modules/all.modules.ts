import userModules from './users/index'
import express from 'express';

const router = express.Router();

router.use('/api', userModules);

export default router;
