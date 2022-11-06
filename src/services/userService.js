const User = require('../models/User');
const bcrypt = require('bcrypt');
const {saltRounds} = require('../config/appConfig');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
require('dotenv').config();


const jwtSign = promisify(jwt.sign);


exports.getUser = (userId) => User.findById(userId);

exports.updateUser = (userId, data) => User.findByIdAndUpdate(userId, data, {runValidators: true});


exports.register = async ({username, password, city, rePassword}, imageId) => {
    const existing = await User.findOne({username});

    if(existing){
        throw {
            message: 'Username already taken!',
        }
    };
    
    if(username === ''){
        throw{
            message: 'Username field is required!'
        }
    } else if(username.length <= 2){
        throw{
            message: 'Username must be longer than 2 characters',
        }
    }

    if(city === ''){
        throw{
            message: 'City field is required!'
        }
    }

    if(password !== rePassword){
        throw{
            message: 'Password mismatch!',
        }
    } else{
        if(password.length <= 3){
            throw{
                message: 'Password must be longer than 3 characters',
            }
        }
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let createdUser = await User.create({
        username,
        password: hashedPassword,
        city,
        profileImage: imageId,
    });

    return createSession(createdUser);

};

exports.login = async ({username, password}) => {
    const user = await User.findOne({username});

    if(!user){
        throw{
            message: 'No such user',
        }
    };

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid){
        throw {
            message: 'Invalid password or username',
        }
    };

    return createSession(user);
};



const createSession = async (user) => {
    const payload = {_id: user._id, username: user.username, imageId: user.profileImage};

    const token = await jwtSign(payload, process.env.TOKEN_SECRET, {expiresIn: '2d'});

    return{
        _id: user._id,
        accessToken: token,
        username: user.username,
        imageId: user.profileImage,
    };
};