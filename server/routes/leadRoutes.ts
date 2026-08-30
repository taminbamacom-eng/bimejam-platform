import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import { getHotLeads } from '../controllers/dashboardController';

const router = Router();

router.get('/hot', getHotLeads);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;

