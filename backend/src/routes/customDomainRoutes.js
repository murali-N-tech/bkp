import express from 'express';
import {
  createCustomDomain,
  getUserCustomDomains,
  getCustomDomainById,
  updateCustomDomain,
  deleteCustomDomain,
} from '../controllers/customDomainController.js';

const router = express.Router();

router.post('/', createCustomDomain);
router.get('/user/:userId', getUserCustomDomains);
router.get('/:id', getCustomDomainById);
router.put('/:id', updateCustomDomain);
router.delete('/:id', deleteCustomDomain);

export default router; // This must be present