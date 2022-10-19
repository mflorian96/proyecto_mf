const newfecha = require('date-fns');
const pool = require('../database');

const helpers = {};

helpers.formatDate = (newdate) => {
    const formato =  newfecha.format(newdate,"yyyy-MM-dd hh:mm aaaaa'm'")
    return formato;
};

module.exports = helpers;