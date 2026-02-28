import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { applicationValidation } from '../validations/application.validation';
import applicationController from '../controllers/application.controller';
import { adminAuth } from '../middlewares/auth.validation';

const router = Router();

// Public route
router.post('/application', validate(applicationValidation.create), applicationController.createApplication);

// Admin routes
router.get('/job/:jobId', applicationController.getApplicationsByJob);
router.patch('/:id/status',adminAuth, applicationController.updateStatus);

const applicationRoute = router
export default applicationRoute;