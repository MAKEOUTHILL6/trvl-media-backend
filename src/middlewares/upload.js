const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
require('dotenv').config();

const storage = new GridFsStorage({ url: process.env.DB_URL });

exports.upload = multer({ storage });