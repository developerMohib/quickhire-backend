import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { validate } from '../middlewares/validation';
import { jobValidation } from '../validations/job.validation';
import { adminAuth } from '../middlewares/auth.validation';

const router = Router();
router.get('/jobs', jobController.listJobs);
router.get('/categories', jobController.getCategories);
router.get('/locations', jobController.getLocations);
router.get('/:id', jobController.getJob);

// Admin routes
router.post('/job',adminAuth, validate(jobValidation.create), jobController.createJob);
router.put('/:id',adminAuth, validate(jobValidation.update), jobController.updateJob);
router.delete('/:id',adminAuth, jobController.deleteJob);
const jobRoute = router
export default jobRoute;