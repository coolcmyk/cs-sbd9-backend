// src/utils/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true
  });
} else {
  console.warn('CLOUDINARY_URL environment variable not found');
}

module.exports = cloudinary;