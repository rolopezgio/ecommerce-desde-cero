import { CarritoDAO } from "../dao/carrito.dao.js";
import { ticketModelo } from "../dao/models/ticket.model.js";
import { ProductosDAO } from "../dao/productos.dao.js";

const carritoService=new CarritoDAO()
const productosService=new ProductosDAO()

export const comprarCarrito=async(req,res,next)=>{

    let {idCarrito}=req.params

    let carrito
    try {
        carrito=await carritoService.getById(idCarrito)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Carrito con id ${idCarrito} no existe...!!!`})
        }

        let importe=0
        let conStock=[]
        let sinStock=[]

        for(let i=0; i<carrito.productos.length;i++){
            let codigo=carrito.productos[i].producto._id
            let cantidad=carrito.productos[i].cantidad
            let precio=0
            let stock=0
            let producto=await productosService.getById(codigo)
            if(producto){
                precio=producto.precio
                stock=producto.stock
                if(cantidad<=stock){
                    importe+=precio*cantidad
                    conStock.push({
                        codigo, descrip: producto.descrip, cantidad, precio, stock, subtotal:precio*cantidad
                    })
                    producto.stock=producto.stock-cantidad
                    await productosService.update(codigo, producto)
                }else{
                    sinStock.push(
                        {
                            producto:codigo,
                            cantidad
                        }
                    )
                }
            }else{
                sinStock.push(
                    {
                        producto:codigo,
                        cantidad
                    }
                )
            }
        }

        let nuevoTicket={
            codigo: Date.now(),
            fecha: new Date(),
            email: req.user.email,
            importe,
            detalle: conStock
        }

        nuevoTicket=await ticketModelo.create(nuevoTicket)

        carrito.productos=sinStock
        await carritoService.update(idCarrito, carrito)

        res.render('ticket', { nuevoTicket });
    } catch (error) {
        return next(error)
    }

}

export const getCarritoById=async(req,res,next)=>{

    let {idCarrito}=req.params

    let carrito
    try {
        carrito=await carritoService.getById(idCarrito)
    } catch (error) {
        return next(error)
    }

    let total = 0;
    carrito.productos.forEach(p => {
        total += p.cantidad * p.producto.precio;
    });

    console.log(carrito);
    res.render('carrito', {carrito, productos:carrito.productos, total, idCarrito})
}

export const agregaProductoCarrito=async(req, res)=>{

    let {idCarrito, idProducto}=req.params

    let carrito=await carritoService.getById(idCarrito)
    if(!carrito){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
    }

    let indiceProducto=carrito.productos.findIndex(p=>p.producto._id==idProducto)
    if(indiceProducto!==-1){
        carrito.productos[indiceProducto].cantidad++
    }else{
        carrito.productos.push({producto:idProducto, cantidad:1})
    }

    await carritoService.update(idCarrito, carrito)
    carrito=await carritoService.getById(idCarrito)

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({carritoActualizado:carrito});
}