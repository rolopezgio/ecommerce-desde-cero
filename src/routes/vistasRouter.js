import { Router } from 'express';
import { getProductos, handleRegistro, home, login, renderRegistro } from '../controllers/vistas.controller.js';
import { passportView } from '../utils.js';
export const router=Router()

router.get('/', home);
router.get('/productos', passportView("jwt"), getProductos)
router.get("/login", login)
router.get('/registro', renderRegistro);
router.post('/registro', handleRegistro);