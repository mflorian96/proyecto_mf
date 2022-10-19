const bcrypt = require('bcryptjs');
const ncrypt = require('ncrypt-js');
const pool = require('../database');

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.decryptPassword = async (password) => {
  const decrypted = ncrypt.decrypt(password);
  return decrypted;
};

helpers.matchPassword = async (contraseña, savedPassword) => {
  try {
    return await bcrypt.compare(contraseña, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;
