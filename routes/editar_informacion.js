const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

//IR AL PANEL PARA EDITAR INGRESOS//
router.get('/edit_ingreso', isLoggedIn, async (req, res) => {
   const ingresos = await pool.query('SELECT * FROM tb_ingreso WHERE id_ingreso=?',[req.query.id]);
    res.render('armeria/edit_ingreso',{ingresos});
    });

////////////////////////////////////////////////////////////////////////////////////

//ACTUALIZAR REGISTRO DE ARMA INGRESADA//
router.post('/edit_ingreso',isLoggedIn, async (req, res) =>{
    const {nip,nombres,apellidos,lugar_servicio,grado,
    tipo_arma,observaciones,estado_arma}=req.body;

    //OBTENCION DEL ID DEL INGRESO
    const datos = await pool.query('SELECT id_ingreso FROM tb_ingreso WHERE nip=?',[nip]);
    const id=datos[0];
    const id_ingreso = id.id_ingreso;
    const fecha_ingreso = new Date();
    //ACTUALIZACION DE REGISTRO
    const updateingreso = {nip,nombres,apellidos,lugar_servicio,grado,
    tipo_arma,observaciones,estado_arma,fecha_ingreso};
    await pool.query('UPDATE tb_ingreso set? WHERE id_ingreso=?',[updateingreso,id_ingreso]);
    const ingresos = await pool.query('SELECT * FROM tb_ingreso')
    res.render('armeria/ingreso_armas',{ingresos});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//IR AL PANEL PARA EDITAR EGRESOS//
router.get('/edit_egreso', isLoggedIn, async (req, res) => {
    const egresos = await pool.query('SELECT * FROM tb_egreso WHERE id_egreso=?',[req.query.id]);
     res.render('armeria/edit_egreso',{egresos});
     });

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTUALIZAR REGISTRO DE ARMA EGRESADA//
router.post('/edit_egreso',isLoggedIn, async (req, res) =>{
    const {nip,nombres,apellidos,lugar_servicio,grado,
    tipo_arma,observaciones,estado_arma}=req.body;

    //OBTENCION DEL ID DEL INGRESO
    const datos = await pool.query('SELECT id_egreso FROM tb_egreso WHERE nip=?',[nip]);
    const id=datos[0];
    const id_egreso = id.id_egreso;
    const fecha_egreso = new Date();

    //ACTUALIZACION DE REGISTRO
    const updateegreso = {nip,nombres,apellidos,lugar_servicio,grado,
    tipo_arma,observaciones,estado_arma,fecha_egreso};
    await pool.query('UPDATE tb_egreso set? WHERE id_egreso=?',[updateegreso,id_egreso]);
    const egresos = await pool.query('SELECT * FROM tb_egreso')
    res.render('armeria/egreso_armas',{egresos});
});

///////////////////////////////////////////////////////////////////////////////////////////////

//ELIMINAR EGRESOS//
router.get('/delete_egreso',isLoggedIn,async(req,res)=>{
    await pool.query('DELETE FROM tb_egreso WHERE id_egreso=?',[req.query.id]);
    const egresos = await pool.query('SELECT * FROM tb_egreso')
    res.render('armeria/egreso_armas',{egresos});
});

//////////////////////////////////////////////////////////////////////////////////////////////

//CAMBIAR EL ESTADO DE UN USUARIO//
router.get('/estado_activo_usuario', isLoggedIn, async(req, res) =>{
    const estado='ACTIVO';
    const newEstado = {estado};
    //OBTENEMOS LOS DATOS DEL USUARIO
    const datos = await pool.query('SELECT id FROM tb_usuarios WHERE id=?',[req.query.id]);
    const dato = datos[0];
    const id=dato.id;
    //ACTUALIZAMOS EL ESTADO DEL USUARIO
    await pool.query('UPDATE tb_usuarios SET? WHERE id=?',[newEstado,id]);
    const usuarios = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
    res.render('usuarios/usuarios',{usuarios});
});
router.get('/estado_inactivo_usuario', isLoggedIn, async(req, res) =>{
    const estado='INACTIVO';
    const newEstado = {estado};
    //OBTENEMOS LOS DATOS DEL USUARIO
    const datos = await pool.query('SELECT id FROM tb_usuarios WHERE id=?',[req.query.id]);
    const dato = datos[0];
    const id=dato.id;
    //ACTUALIZAMOS EL ESTADO DEL USUARIO
    await pool.query('UPDATE tb_usuarios SET? WHERE id=?',[newEstado,id]);
    const usuarios = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
    res.render('usuarios/usuarios',{usuarios});
});
module.exports=router
