const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  const rows = await pool.query('SELECT * FROM tb_usuarios WHERE usuario = ?', [usuario]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(contraseña, user.contraseña)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.usuario));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Usuario Incorrecto.'));
  }
}));

passport.use('local.signup' , new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  const {nombres, apellidos,nip,telefono,direccion,estado_civil,
    genero,lugar_servicio,correo,grado,tipo_usuario} = req.body;

  const fecha_registro = new Date();
  const estado= 'ACTIVO';
  const perfil = 'img/avatar4.png';
  const cloudinary_id = 'Pendient';
  const descripcion = 'Pendient'

let nuevoarmero={
  nombres,
  apellidos,
  nip,
  telefono,
  direccion,
  estado_civil,
  genero,
  lugar_servicio,
  grado,
  correo,
  fecha_registro
};
  let newUser = {
    usuario,
    tipo_usuario,
    nip,
    fecha_registro,
    contraseña,
    estado,
    descripcion,
    perfil,
    cloudinary_id
  };
  newUser.contraseña = await helpers.encryptPassword(contraseña);
  // Saving in the Database
  await pool.query('INSERT INTO tb_armero SET?',[nuevoarmero]);
  const result = await pool.query('INSERT INTO tb_usuarios SET? ', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
 return  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM tb_usuarios WHERE id = ?', [id]);
  return done(null, rows[0]);
});

