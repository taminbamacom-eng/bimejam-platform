import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  addCustomerNote,
  deleteCustomer,
} from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.post('/:id/notes', addCustomerNote);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
