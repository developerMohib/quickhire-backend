import { Router } from 'express';
import { authValidation, validate } from '../middlewares/validation';
import authController from '../controllers/auth.controller';

const router = Router();

// Public route to log in
router.post('/login', validate(authValidation.login), authController.login);

// Optional: Register route
router.post('/register', validate(authValidation.register), authController.register);
const authRoute =router
export default authRoute;