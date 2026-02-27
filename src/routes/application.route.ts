import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { applicationValidation } from '../validations/application.validation';
import applicationController from '../controllers/application.controller';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

// Public route
router.post('/', validate(applicationValidation.create), applicationController.createApplication);

// Admin routes
router.use(adminAuth);
router.get('/job/:jobId', applicationController.getApplicationsByJob);
router.patch('/:id/status', applicationController.updateStatus);

export default router;