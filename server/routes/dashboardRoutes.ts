import { Router } from 'express';
import {
  getSummary,
  getConversationsChart,
  getSources,
  getPopularPages,
  getActivityStats,
  getDashboardStats,
  getHotLeads,
  getOperatorsStatus,
} from '../controllers/dashboardController';

const router = Router();

router.get('/summary', getSummary);
router.get('/conversations-chart', getConversationsChart);
router.get('/sources', getSources);
router.get('/pages', getPopularPages);
router.get('/activity', getActivityStats);
router.get('/stats', getDashboardStats);

export default router;

