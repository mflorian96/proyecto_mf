const express = require('express');
const router = express.Router();
const {
  isLoggedIn
} = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const upload = require("../public/js/multer");
const cloudinary = require('../public/js/Cloudinary');
const path = require('path')


//PANEL PARA VISUALIZAR TODOS LOS MIEMBROS DEL PERSONAL//
router.get('/agentes', isLoggedIn, async (req, res) => {
    //CONSULTAMOS LA TABLA USUARIO Y ARMERO
    const usuarios = await pool.query('SELECT * FROM tb_personal');
    res.render('agentes/agentes', {
      usuarios
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA AGREGAR NUEVOS AGENTES//
router.get('/add_agentes', isLoggedIn, async (req, res) => {
    res.render('agentes/add_agentes');
  });

//////////////////////////////////////////////////////////////////////////////////////////////////

//AGREGAR NUEVOS USUARIOS//
router.post('/add_agentes', upload.single("image"), isLoggedIn, async (req, res) => {
    //OBTENEMOS LOS DATOS DE LA SOLICITUD
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'perfiles'
    });
    const {
      nombres,
      apellidos,
      nip,
      telefono,
      direccion,
      estado_civil,
      genero,
      lugar_servicio,
      correo,
      grado,
    } = req.body;
    const fecha_registro = new Date();
    const perfil = result.secure_url;
    const cloudinary_id = result.public_id;
    const estado = 'ACTIVO';
    //CREAMOS EL MODELO DEL ARMERO QUE SERA INSERTADO EN LA BASE DE DATOS
    let nuevo_agente = {
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
      fecha_registro,
      perfil,
      estado,
      cloudinary_id
    };
    // GUARDAMOS LOS DATOS DEL NUEVO USUARIO EN LA BASE DE DATOS
    await pool.query('INSERT INTO tb_personal SET?', nuevo_agente);
    //REFRESACMOS LA PAGINA
    const usuarios = await pool.query('SELECT * FROM tb_personal');
    res.render('agentes/agentes', {
      usuarios
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA EDITAR INFORMACION DE USUARIOS//
router.get('/edit_agente', isLoggedIn, async (req, res) => {
    const datos = await pool.query('SELECT * FROM tb_personal WHERE id_agente=?', [req.query.id]);
    res.render('agentes/edit_agente', {
      datos
    });
  });
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  //EDICION DE LA INFOMRACION DE LOS USUARIOS//
  router.post('/edit_agente', upload.single("image"), isLoggedIn, async (req, res) => {
    //OBTENIENDO LOS DATOS DEL CUERPO DE LA SOLICUTD
  
    let result, perfil, cloudinary_id;
  
    if (req.file) {
      if (!req.body.cloudinary_id == null) {
        await cloudinary.uploader.destroy(req.body.cloudinary_id, {
          folder: 'perfiles'
        });
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'perfiles'
        });
        perfil = result.secure_url;
        cloudinary_id = result.public_id;
        console.log("Se modifico la imagen");
      }
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'perfiles'
      });
      perfil = result.secure_url;
      cloudinary_id = result.public_id;
      console.log("Se modifico la imagen");
    } else {
      perfil = req.body.old_image;
      cloudinary_id = req.body.cloudinary_id;
      console.log("No se modifico la imagen");
    }
    const {
      nombres,
      apellidos,
      nip,
      telefono,
      direccion,
      estado_civil,
      genero,
      correo,
      grado,
      lugar_servicio
    } = req.body;
    const fecha_registro = new Date();
    let id_agente = req.body.id_agente;
    //CREANDO EL MODELO DE LOS DATOS DEL ARMERO
    let editagente = {
      nombres,
      apellidos,
      nip,
      telefono,
      direccion,
      estado_civil,
      genero,
      grado,
      correo,
      lugar_servicio,
      perfil,
      cloudinary_id,
      fecha_registro
    };

      //ACTUALIZANDO REGISTROS EN LA BASE DE DATOS
      await pool.query('UPDATE tb_personal SET? WHERE id_agente=?', [editagente, id_agente]);

    //REFRESCAMOS LA PAGINA
    const usuarios = await pool.query('SELECT * FROM tb_personal');
    res.render('agentes/agentes', {
      usuarios
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////  

//////////////////////////////////////////////////////////////////////////////////////////////

//CAMBIAR EL ESTADO DE UN USUARIO//
router.get('/estado_activo_agente', isLoggedIn, async(req, res) =>{
    const estado='ACTIVO';
    const newEstado = {estado};
    //OBTENEMOS LOS DATOS DEL USUARIO
    const id_agente =req.query.id;
    //ACTUALIZAMOS EL ESTADO DEL USUARIO
    await pool.query('UPDATE tb_personal SET? WHERE id_agente=?',[newEstado,id_agente]);
    const usuarios = await pool.query('SELECT * FROM tb_personal');
    res.render('agentes/agentes',{usuarios});
});
router.get('/estado_inactivo_agente', isLoggedIn, async(req, res) =>{
    const estado='INACTIVO';
    const newEstado = {estado};
    //OBTENEMOS LOS DATOS DEL USUARIO
    const id_agente= req.query.id;
    //ACTUALIZAMOS EL ESTADO DEL USUARIO
    await pool.query('UPDATE tb_personal SET? WHERE id_agente=?',[newEstado,id_agente]);
    const usuarios = await pool.query('SELECT * FROM tb_personal');
    res.render('agentes/agentes',{usuarios});
});

  ///////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA INGRESAR UNA NUEVA ARMA//
router.get('/ingreso_agente', isLoggedIn, async (req, res) => {
    const datos = await pool.query('SELECT * FROM tb_personal WHERE id_agente=?', [req.query.id]);
    res.render('armeria/add_ingreso_armas', {
      datos
    });
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA EGRESAR UNA ARMA//
router.get('/egreso_agente', isLoggedIn, async (req, res) => {
    const datos = await pool.query('SELECT * FROM tb_personal WHERE id_agente=?', [req.query.id]);
    res.render('armeria/add_egreso_armas', {
      datos
    });
  });
module.exports=router;