const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

// SIGNUP
router.get('/registro', (req, res) => {
 
  res.render('login/registro');
});

router.post('/registro', passport.authenticate('local.signup', {
  successRedirect: '/dashboard', 
  failureRedirect: '/registro',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('index');
});

router.post('/signin', async (req, res, next) => {
  req.check('usuario', 'El Usuario es Requerido').notEmpty();
  req.check('contraseña', 'La Contraseña es Requerida').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/');
  }
    passport.authenticate('local.signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/dashboard', isLoggedIn, async (id, res) => {
  const usuarios = await pool.query('SELECT * FROM tb_usuarios where id=?',[id.user.id]);
  const count_users = await pool.query('select * from tb_usuarios');
  const  count_ingresos = await pool.query('select * from tb_ingreso');
  const  count_egresos = await pool.query('select * from tb_egreso');
  const total_users = count_users.length;
  const total_ingresos = count_ingresos.length;
  const total_egresos = count_egresos.length;
  res.render('panel/dashboard',{usuario:usuarios[0],total_users:total_users,
  total_ingresos:total_ingresos, total_egresos:total_egresos});
});

module.exports = router;
