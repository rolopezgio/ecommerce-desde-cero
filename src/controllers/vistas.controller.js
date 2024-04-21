import bcrypt from 'bcrypt';
import { usuarioModelo } from '../dao/models/usuario.model.js';
import { ProductosDAO } from '../dao/productos.dao.js';
const productosService=new ProductosDAO()

export const home=(req,res)=>{
    res.status(200).render("home")
}

export const login=(req,res)=>{
    res.status(200).render("login")
}

export const getProductos=async(req,res)=>{

    let productos=await productosService.get()
    // map a productos, para agregar una propiedad carrito_id
    if(!productos){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
    }

    res.setHeader('Content-Type','text/html')
    res.status(200).render("productos",{
        productos, 
        usuario:req.user,
        helpers:{
            mayuscula(valor) {return valor.toUpperCase()},
            resaltar(dato) {return `<b>${dato}</b>`},
            carrito() {return `"${req.user.carrito_id}"`}
        }
    })
}

export const renderRegistro = (req, res) => {
    let { error } = req.query;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('registro', { error });
};

export const handleRegistro = async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
        return res.redirect('/registro?error=Complete todos los datos');
    }

    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regMail.test(email)) {
        return res.redirect('/registro?error=Mail con formato incorrecto...!!!');
    }

    let existe = await usuarioModelo.findOne({ email });
    if (existe) {
        return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let usuario = await usuarioModelo.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age
        });
        res.redirect('/registro?success=Usuario registrado correctamente');
    } catch (error) {
        console.error(error);
        return res.redirect('/registro?error=Error al registrar el usuario');
    }
}