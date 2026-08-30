import { Router } from 'express';
import {
  getConversations,
  getConversationById,
  getConversationMessages,
  createConversation,
  sendMessage,
  assignConversation,
  updateConversationStatus,
  addConversationNote,
} from '../controllers/conversationController';

const router = Router();

router.get('/', getConversations);
router.get('/:id', getConversationById);
router.get('/:id/messages', getConversationMessages);
router.post('/', createConversation);
router.post('/:id/messages', sendMessage);
router.post('/:id/notes', addConversationNote);
router.patch('/:id/assign', assignConversation);
router.patch('/:id/status', updateConversationStatus);

export default router;
