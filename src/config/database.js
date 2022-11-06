const mongoose = require('mongoose');
require('dotenv').config();

exports.InitializeDatabase = () => mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

