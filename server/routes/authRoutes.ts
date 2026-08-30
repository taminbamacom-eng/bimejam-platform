import { Router } from 'express';
import {
  login,
  register,
  getMe,
  listUsers,
  updateUser,
  deleteUser
} from '../controllers/authController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', authenticateToken, requireRole(['ADMIN']), register);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, listUsers);
router.put('/users/:id', authenticateToken, requireRole(['ADMIN']), updateUser);
router.delete('/users/:id', authenticateToken, requireRole(['ADMIN']), deleteUser);

export default router;
