import passport from 'passport';
import bcrypt from 'bcrypt';
import { usuarioModelo } from '../dao/models/usuario.model.js';

export const registerUser = async (req, res) => {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.redirect('/registro?error=Complete todos los datos');
    }

    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regMail.test(email)) {
        return res.redirect('/registro?error=Formato de mail incorrecto');
    }

    let existe = await usuarioModelo.findOne({ email });
    if (existe) {
        return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let usuario = await usuarioModelo.create({ nombre, email, password: hashedPassword });

        req.login(usuario, (err) => {
            if (err) {
                return res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
            }
            res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`);
        });
    } catch (error) {
        res.redirect('/registro?error=Error inesperado. Reintente en unos minutos');
    }
}

export const loginUser = (req, res, next) => {
  passport.authenticate('login', {
    successRedirect: '/products',
    failureRedirect: '/login?error=credenciales incorrectas',
  })(req, res, async (err) => {
    if (!err) {
      try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { last_connection: new Date() });
      } catch (error) {
        console.error('Error al actualizar last_connection:', error);
      }
    }
    next(err);
  });
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { last_connection: new Date() });
  } catch (error) {
    console.error('Error al actualizar last_connection:', error);
  }

  req.logout();
  res.redirect('/login');
};