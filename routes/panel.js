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

//PANEL PARA VISUALIZAR TODOS LOS USUARIOS//
router.get('/usuarios', isLoggedIn, async (req, res) => {
  //CONSULTAMOS LA TABLA USUARIO Y ARMERO
  const usuarios = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
  res.render('usuarios/usuarios', {
    usuarios
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA AGREGAR NUEVOS USUARIOS//
router.get('/usuarios_add', isLoggedIn, async (req, res) => {
  res.render('usuarios/usuarios_add');
});

//////////////////////////////////////////////////////////////////////////////////////////////////

//AGREGAR NUEVOS USUARIOS//
router.post('/usuarios_add', upload.single("image"), isLoggedIn, async (req, res) => {
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
    tipo_usuario,
    usuario
  } = req.body;
  const contraseña = req.body.password;
  const fecha_registro = new Date();
  const estado = 'ACTIVO';
  const perfil = result.secure_url;
  const cloudinary_id = result.public_id;
  //CREAMOS EL MODELO DEL ARMERO QUE SERA INSERTADO EN LA BASE DE DATOS
  let nuevo_armero = {
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
  };
  //CREAMOS EL MODELO DEL USUARIO PARA INSERTARLO EN LA BASE DE DATOS
  let newUser = {
    usuario,
    tipo_usuario,
    nip,
    fecha_registro,
    contraseña,
    estado,
    perfil,
    cloudinary_id
  };
  //ENCRIPTAMOS LA CONTRASEÑA DEL USUARIO
  newUser.contraseña = await helpers.encryptPassword(contraseña);
  // GUARDAMOS LOS DATOS DEL NUEVO USUARIO EN LA BASE DE DATOS
  await pool.query('INSERT INTO tb_armero SET?', nuevo_armero);
  await pool.query('INSERT INTO tb_usuarios SET ? ', newUser);
  //REFRESACMOS LA PAGINA
  const usuarios = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
  res.render('usuarios/usuarios', {
    usuarios
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA EDITAR INFORMACION DE USUARIOS//
router.get('/edit_usuario', isLoggedIn, async (req, res) => {
  const datos = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.nip = D.nip WHERE C.nip=?', [req.query.id]);
  res.render('usuarios/edit_usuario', {
    datos:datos
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//EDICION DE LA INFOMRACION DE LOS USUARIOS//
router.post('/edit_usuario', upload.single("image"), isLoggedIn, async (req, res) => {
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
    usuario
  } = req.body;
  const fecha_registro = new Date();
  const contraseña = req.body.password;
  //OBTENIENDO EL ID DEL USUARIO
  const datos = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.nip = D.nip WHERE C.nip=?',
    [nip]);
  const dato = datos[0];
  const id_armero = dato.id_armero;
  const id = dato.id;
  //CREANDO EL MODELO DE LOS DATOS DEL ARMERO
  let newarmero = {
    nombres,
    apellidos,
    nip,
    telefono,
    direccion,
    estado_civil,
    genero,
    grado,
    correo,
    fecha_registro,
  };
  console.log(contraseña)
  //ENCRIPTACION DE LA CONTRASEÑA
  if (!contraseña) {
    console.log('la contraseña es null')
       //CREANDO EL MODELO DEL USUARIO
       let newUser = {
        usuario,
        nip,
        fecha_registro,
        perfil,
        cloudinary_id
      };
      //ACTUALIZANDO REGISTROS EN LA BASE DE DATOS
      await pool.query('UPDATE tb_armero SET? WHERE id_armero=?', [newarmero, id_armero]);
      await pool.query('UPDATE tb_usuarios SET? WHERE id=?', [newUser, id]);
  } else {
    console.log('la contraseña es diferente de null')
    //CREANDO EL MODELO DEL USUARIO
    let newUser = {
      usuario,
      nip,
      fecha_registro,
      contraseña,
      perfil,
      cloudinary_id
    };
    newUser.contraseña = await helpers.encryptPassword(contraseña);
    //ACTUALIZANDO REGISTROS EN LA BASE DE DATOS
    await pool.query('UPDATE tb_armero SET? WHERE id_armero=?', [newarmero, id_armero]);
    await pool.query('UPDATE tb_usuarios SET? WHERE id=?', [newUser, id]);
  }
  //REFRESCAMOS LA PAGINA
  const usuarios = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
  res.render('usuarios/usuarios', {
    usuarios
  });
});

///////////////////////////////////////////////////////////////////////////////////////////

//PANEL DE ROLES DE USUARIO//
router.get('/rol_user', isLoggedIn, async (req, res) => {
  //CONSULTAMOS LA TABLA USUARIO Y ARMERO PARA OBTENER LOS ROLES
  const estado = 'ACTIVO';
  const roles = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero WHERE C.estado=?', [estado]);
  res.render('usuarios/rol_user', {
    roles
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//PANEL EDITAR ROLES DE USUARIO// 
router.get('/edit_rol_user', isLoggedIn, async (req, res) => {
  //OBTENEMOS EL NIP DEL ELEMENTO SELECCIONADO EN LA TABLA
  const nip = req.query.id;
  //CONSULTAMOS LOS DATOS DEL USUARIO SELECCIONADO
  const roles = await pool.query('SELECT * FROM tb_usuarios C inner join tb_armero D on C.nip = D.nip WHERE C.nip=?', [nip]);
  res.render('usuarios/edit_rol_user', {
    roles
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//EDITAR ROL DE USUARIO
router.post('/edit_rol_user', isLoggedIn, async (req, res) => {
  //CREAMOS EL MODELO DE DATOS DE LA SOLICITUD
  const {
    nombres,
    apellidos,
    nip,
    tipo_usuario,
    descripcion
  } = req.body;
  const rol = {
    tipo_usuario,
    descripcion
  };
  const datos_personales = {
    nombres,
    apellidos
  };
  //ACTUALIZAMOS LOS REGISTROS
  await pool.query('UPDATE tb_usuarios SET? WHERE nip=?', [rol, nip]);
  await pool.query('UPDATE tb_armero SET? WHERE nip=?', [datos_personales, nip]);
  //REFRESCAMOS LA PAGINA
  const roles = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero')
  res.render('usuarios/rol_user', {
    roles
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PANEL DE LOS DEPARTAMENTOS//
router.get('/depart_user', isLoggedIn, async (req, res) => {
  const estado = 'ACTIVO';
  //CONSULTAMOS LA TABLA ARMERO PARA OBTENER LOS DATOS DEL USUARIO
  const departamentos = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero WHERE C.estado=?',
    [estado]);
  res.render('usuarios/depart_user', {
    departamentos
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//PANEL PARA EDITAR EL LUGAR DE SERVICIO//
router.get('/edit_depart_user', isLoggedIn, async (req, res) => {
  //OBTENEMOS EL NIP DEL ELEMENTO SELECCIONADO EN LA TABLA
  const nip = req.query.id;
  //CONSULTAMOS LA TABLA ARMERO PARA OBTENER SUS DATOS
  const departamento = await pool.query('SELECT * FROM tb_armero WHERE nip=?', [nip]);
  res.render('usuarios/edit_depart_user', {
    departamento
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//EDITAR LUGAR DE TRABAJO//
router.post('/edit_depart_user', isLoggedIn, async (req, res) => {
  //CREAMOS EL MODELO DE DATOS CON LA SOLICITUD
  const {
    lugar_servicio
  } = req.body;
  const newdepart = {
    lugar_servicio
  }
  const nip = req.body.nip;
  //ACTUALIZAMOS EL REGISTRO
  await pool.query('UPDATE tb_armero SET? WHERE nip=?', [newdepart, nip]);
  //REFRESCAMOS LA PAGINA
  const departamentos = await pool.query('SELECT * FROM tb_usuarios C inner join  tb_armero D on C.id = D.id_armero');
  res.render('usuarios/depart_user', {
    departamentos
  });
});
module.exports = router;