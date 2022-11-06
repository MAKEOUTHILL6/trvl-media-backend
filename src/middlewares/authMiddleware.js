const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

const jwtVerify = promisify(jwt.verify);

exports.auth = async (req, res, next) => {
    // let token = req.headers.authorization?.split(' ')[1];
    let token = req.headers['x-authorization'];

    if (token) {
        try {
            let decodedToken = await jwtVerify(token, process.env.TOKEN_SECRET);

            req.user = decodedToken;

        } catch (error) {
            console.log(error.message);
            res.status(400).json({ message: error.message });
        }
    };


    next();
};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated!' });
    };

    next();
};


exports.isGuest = (req, res, next) => {
    if(req.user){
        return res.status(401).json({message: 'Already logged in!'});
    }

    next();
}