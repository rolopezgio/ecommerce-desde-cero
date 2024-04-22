import { passportView } from '../utils.js';
import express from 'express';
import { registroFuncion, loginFuncion, logoutUser } from '../controllers/session.controller.js';

const sessionsRouter = express.Router();

sessionsRouter.post("/registro", passportView("registro"), registroFuncion)
sessionsRouter.post("/login", passportView("login"), loginFuncion)
sessionsRouter.get('/logout', logoutUser);

export default sessionsRouter;