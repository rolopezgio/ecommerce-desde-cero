import { Router } from 'express';
import { agregaProductoCarrito, comprarCarrito, getCarritoById } from '../controllers/carrito.controller.js';
import { passportView } from '../utils.js';
export const router=Router()

router.get('/:idCarrito', getCarritoById)
router.get('/:idCarrito/comprar', passportView("jwt"), comprarCarrito)
router.post("/:idCarrito/producto/:idProducto", agregaProductoCarrito)