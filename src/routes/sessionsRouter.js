import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/session.controller.js';

const sessionsRouter = express.Router();

sessionsRouter.post('/registro', registerUser);
sessionsRouter.post('/login', loginUser);
sessionsRouter.get('/logout', logoutUser);

export default sessionsRouter;


