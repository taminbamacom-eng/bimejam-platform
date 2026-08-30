import { Router } from 'express';
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  createSession,
  getSession,
  submitAnswers,
} from '../controllers/quotationWorkflowController';

const router = Router();

// Workflows Management APIs
router.get('/quotation-workflows', getWorkflows);
router.post('/quotation-workflows', createWorkflow);
router.get('/quotation-workflows/:id', getWorkflow);
router.put('/quotation-workflows/:id', updateWorkflow);
router.delete('/quotation-workflows/:id', deleteWorkflow);

// Quotation Session APIs
router.post('/quotation-sessions', createSession);
router.get('/quotation-sessions/:id', getSession);
router.post('/quotation-sessions/:id/answers', submitAnswers);

export default router;
