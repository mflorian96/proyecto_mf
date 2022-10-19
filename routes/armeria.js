const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');


//IR AL PANEL DE ARMAS INGRESADAS//
router.get('/ingreso_armas', isLoggedIn, async (req, res) => {
  const ingresos = await pool.query('SELECT * FROM tb_ingreso')
  res.render('armeria/ingreso_armas',{ingresos});
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////  

//ENGREGAR Y ELIMINAR ARMA INGRESADA//
router.get('/eliminar_arma',isLoggedIn, async (req, res)=>{
  const id_ingreso = req.query.id;
    //CONSULTA PARA OBTENER EL REGISTRO DEL ARMA INGRESADA
  const ingreso = await pool.query('SELECT * FROM tb_ingreso WHERE id_ingreso=?',[id_ingreso]);
  const {id_agente,nip,nombres,apellidos,lugar_servicio,grado,
  tipo_arma,observaciones,fecha_ingreso,marca,numero_serie}=ingreso[0];
  const fecha_egreso= new Date();
    //CONSULTA PARA OBTENER LOS DATOS DEL ARMERO DE TURNO
  let datos_armeros = await pool.query('SELECT nip FROM tb_armero WHERE id_armero=?',[req.user.id]);
  const dato_armero = datos_armeros[0];
  const nip_armero_turno=dato_armero.nip;
  const estado_arma='ENTREGADA';
    //INSERCION DEL ARMA ENTREGADA A LA TABLA EGRESO
  const nuevo_egreso={id_agente,nip,nombres,apellidos,lugar_servicio,grado,
  tipo_arma,observaciones,fecha_egreso,nip_armero_turno,marca,numero_serie,estado_arma}
  await pool.query('INSERT INTO tb_egreso SET?',[nuevo_egreso]);
    //INSERCION A LA TABLA HISTORIAL 
  const newhistorial={id_agente,nip,nombres,apellidos,lugar_servicio,
    grado,tipo_arma,observaciones,estado_arma,fecha_egreso,marca,numero_serie,fecha_ingreso, nip_armero_turno}
  await pool.query('INSERT INTO tb_historial SET?',[newhistorial]);
    //ELIMINACION DEL REGISTRO DE INGRESO DE ARMAS 
  await pool.query('DELETE FROM tb_ingreso WHERE id_ingreso=?',[id_ingreso]);
  const ingresos = await pool.query('SELECT * FROM tb_ingreso')
  res.render('armeria/ingreso_armas',{ingresos});
}); 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//IR AL PANEL PARA INGRESAR ARMAS//
router.get('/add_ingreso_armas', isLoggedIn, async (id, res) => {
    res.render('armeria/add_ingreso_armas');
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INGRESAR NUEVA ARMA//
  router.post('/add_ingreso_armas', isLoggedIn, async (req, res) => {
    const {nip, nombres, apellidos, lugar_servicio,
    grado, tipo_arma,observaciones,estado_arma,marca,numero_serie}= req.body;
      //CONSULTA PARA OBTENER LOS DATOS DEL AGENTE
    let datos_agente =await pool.query('SELECT id_agente FROM tb_personal WHERE nip=?',[nip]);
    const dato_agente = datos_agente[0];
    const id_agente=dato_agente.id_agente;
      //CONSULTA PARA OBTENER EL NIP DEL ARMERO DE TURNO
    let datos_armeros = await pool.query('SELECT nip FROM tb_armero WHERE id_armero=?',[req.user.id]);
    const dato_armero = datos_armeros[0];
    const nip_armero_turno=dato_armero.nip;
    const fecha_ingreso = new Date();
      //INSERCION DE LA NUEVA ARMA INGRESADA
    const newarma={id_agente,nip,nombres,apellidos,lugar_servicio,
    grado,tipo_arma,observaciones,estado_arma,marca,numero_serie,fecha_ingreso, nip_armero_turno}
    await pool.query('INSERT INTO tb_ingreso SET?',[newarma]);
    const ingresos = await pool.query('SELECT * FROM tb_ingreso')
    res.render('armeria/ingreso_armas',{ingresos});
  });

/////////////////////////////////////////////////////////////////////////////////////////////////

//IR AL PANEL DE ARMAS ENTREGAS//
router.get('/egreso_armas', isLoggedIn, async (req, res) => {
  const egresos = await pool.query('SELECT * FROM tb_egreso')
    res.render('armeria/egreso_armas',{egresos});
  });

///////////////////////////////////////////////////////////////////////////////////////////////

//IR AL PANEL PARA ENTREGAR UNA ARMA//
router.get('/add_egreso_armas', isLoggedIn, async (id, res) => {
    res.render('armeria/add_egreso_armas');
  });

///////////////////////////////////////////////////////////////////////////////
//ENTREGAR NUEVA ARMA//
  router.post('/add_egreso_armas', isLoggedIn, async (req, res) => {
    const {nip, nombres, apellidos, lugar_servicio,
    grado, tipo_arma,observaciones,estado_arma,marca,numero_serie}= req.body;
      //CONSULTA PARA OBTENER LOS DATOS DEL AGENTE
    let datos_agente =await pool.query('SELECT id_agente FROM tb_personal WHERE nip=?',[nip]);
    const dato_agente = datos_agente[0];
    const id_agente=dato_agente.id_agente;
      //CONSULTA PARA OBTENER LOS DATOS DEL ARMERO DE TURNO
    let datos_armeros = await pool.query('SELECT nip FROM tb_armero WHERE id_armero=?',[req.user.id]);
    const dato_armero = datos_armeros[0];
    const nip_armero_turno=dato_armero.nip;
    const fecha_egreso = new Date();
      //INSERCION DE LA NUEVA ARMA A LA TABLA EGRESO
    const newarma={id_agente,nip,nombres,apellidos,lugar_servicio,
    grado,tipo_arma,observaciones,estado_arma,fecha_egreso,marca,numero_serie, nip_armero_turno}
    await pool.query('INSERT INTO tb_egreso SET?',[newarma]);
    const egresos = await pool.query('SELECT * FROM tb_egreso')
    res.render('armeria/egreso_armas',{egresos});
  });

  //////////////////////////////////////////////////////////////////////////////////////////////

// HISTORIAL DE INGRESOS Y EGRESOS//
router.get('/historial', isLoggedIn, async (req, res) => {
  const historiales = await pool.query('SELECT * FROM tb_historial')  
  res.render('armeria/historial',{historiales});
  });
  module.exports= router;