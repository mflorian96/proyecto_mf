const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dvga4vznt',
  api_key: '111194216593889',
  api_secret: 'zAA5UpntL-cgf2_NV0OCHb-6hLs'
});

module.exports = cloudinary;