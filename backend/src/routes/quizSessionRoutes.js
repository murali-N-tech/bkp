import express from 'express';
import {
  createQuizSession,
  getAssignmentPerformance,
  exportAssignmentToExcel,
} from '../controllers/quizSessionController.js';

const router = express.Router();

/**
 * Student routes
 */
router.post('/', createQuizSession);

/**
 * Teacher routes
 */
router.get('/performance/:domainId', getAssignmentPerformance);
router.get('/export/:domainId', exportAssignmentToExcel);

export default router;
