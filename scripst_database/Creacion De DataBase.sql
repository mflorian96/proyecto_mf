#CREACION DE LA BASE DE DATOS 
CREATE DATABASE db_pncarmeria;

use db_pncarmeria;

#CREACION DE LA TABLA ARMERO
CREATE TABLE tb_armero(
id_armero INT (11) PRIMARY KEY AUTO_INCREMENT,
grado VARCHAR (50) NOT NULL,
nip VARCHAR(20) NOT NULL,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
telefono VARCHAR(15) NOT NULL,
direccion VARCHAR(100) NOT NULL,
genero VARCHAR (20) NOT NULL,
estado_civil VARCHAR(30) NOT NULL,
fecha_registro DATETIME,
correo VARCHAR (100) NOT NULL,
lugar_servicio VARCHAR(200) NOT NULL
);
#CREACION DE LA TABLA USUARIOS
CREATE TABLE tb_usuarios(
id INT(11) PRIMARY KEY AUTO_INCREMENT,
usuario VARCHAR(100) NOT NULL,
tipo_usuario VARCHAR(100) NOT NULL,
nip VARCHAR(20) NOT NULL,
perfil VARCHAR(200) NOT NULL,
cloudinary_id VARCHAR (200) NOT NULL,
contraseña VARCHAR (200) NOT NULL,
fecha_registro DATETIME,
descripcion VARCHAR(200) NOT NULL,
estado VARCHAR (50) NOT NULL,
CONSTRAINT fk_armero FOREIGN KEY(id) REFERENCES tb_armero(id_armero)
);
#CREACION DE LA TABLA AGENTE
CREATE TABLE tb_personal(
id_agente INT(11) PRIMARY KEY AUTO_INCREMENT,
grado VARCHAR(50) NOT NULL,
nip VARCHAR(20) NOT NULL,
perfil VARCHAR(200) NOT NULL,
cloudinary_id VARCHAR (200) NOT NULL,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
telefono VARCHAR(15) NOT NULL,
direccion VARCHAR(100) NOT NULL,
genero VARCHAR (50) NOT NULL,
estado VARCHAR(100) NOT NULL,
estado_civil VARCHAR (50) NOT NULL,
correo VARCHAR (100) NOT NULL,
fecha_registro DATETIME,
lugar_servicio VARCHAR(200) NOT NULL
);


#CREACION DE LA TABLA INGRESO
CREATE TABLE tb_ingreso(
id_ingreso INT(11) PRIMARY KEY AUTO_INCREMENT,
id_agente INT(11),
nip VARCHAR(20) NOT NULL,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
grado VARCHAR (50) NOT NULL,
tipo_arma VARCHAR (50) NOT NULL,
lugar_servicio VARCHAR(200) NOT NULL,
fecha_ingreso DATETIME,
marca VARCHAR(100) NOT NULL,
numero_serie VARCHAR(100) NOT NULL,
observaciones VARCHAR (200) NOT NULL,
estado_arma VARCHAR (50) NOT NULL,
nip_armero_turno VARCHAR(20) NOT NULL,
CONSTRAINT fk_ingreso FOREIGN KEY(id_agente) REFERENCES tb_personal(id_agente)
);
#CREACION DE LA TABLA EGRESO
CREATE TABLE tb_egreso(
id_egreso INT(11) PRIMARY KEY AUTO_INCREMENT,
id_agente INT(11),
nip VARCHAR(20) NOT NULL,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
grado VARCHAR (50) NOT NULL,
tipo_arma VARCHAR (50) NOT NULL,
lugar_servicio VARCHAR(200) NOT NULL,
fecha_egreso DATETIME,
marca VARCHAR(100) NOT NULL,
numero_serie VARCHAR(100) NOT NULL,
observaciones VARCHAR (200) NOT NULL,
estado_arma VARCHAR (50) NOT NULL,
nip_armero_turno VARCHAR(20) NOT NULL,
CONSTRAINT fk_egreso FOREIGN KEY(id_agente) REFERENCES tb_personal(id_agente)
);

#CREACION DE LA TABLA HISTORIAL 
CREATE TABLE tb_historial(
id_historial INT(11) PRIMARY KEY AUTO_INCREMENT,
id_agente INT(11),
nip VARCHAR (20) NOT NULL,
nombres VARCHAR (100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
grado VARCHAR(50) NOT NULL,
tipo_arma VARCHAR (50) NOT NULL,
marca VARCHAR(100) NOT NULL,
numero_serie VARCHAR(100) NOT NULL,
lugar_servicio VARCHAR(200) NOT NULL,
fecha_ingreso DATETIME,
fecha_egreso DATETIME,
observaciones VARCHAR (200) NOT NULL,
estado_arma VARCHAR (50) NOT NULL,
nip_armero_turno VARCHAR(20) NOT NULL,
CONSTRAINT fk_arma FOREIGN KEY (id_agente) REFERENCES tb_personal(id_agente)
);


