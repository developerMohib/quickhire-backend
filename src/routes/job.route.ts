import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { validate } from '../middlewares/validation';
import { jobValidation } from '../validations/job.validation';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

// Public routes
router.get('/', validate(jobValidation.listQuery, 'query'), jobController.listJobs);
router.get('/categories', jobController.getCategories);
router.get('/locations', jobController.getLocations);
router.get('/:id', jobController.getJob);

// Admin routes
router.use(adminAuth);
router.post('/', validate(jobValidation.create), jobController.createJob);
router.put('/:id', validate(jobValidation.update), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;