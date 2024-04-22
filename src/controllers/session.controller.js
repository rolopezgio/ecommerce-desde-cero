import jwt from 'jsonwebtoken'


export const registroFuncion = async (req, res) => {
  res.setHeader('Content-Type','application/json');
  res.redirect('/login')
}

export const loginFuncion = async (req, res) => {
  let token=jwt.sign({...req.user}, "CoderCoder123", {expiresIn:"1h"})
  res.cookie("codercookie", token)
  res.setHeader('Content-Type','application/json');
  res.redirect('/productos')
}

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { last_connection: new Date() });
  } catch (error) {
    console.error('Error al actualizar last_connection:', error);
  }
  res.redirect('/login');
};