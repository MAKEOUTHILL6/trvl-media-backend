const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    city: {
        type: String,
        required: true,

    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
        required: true,
     
    },
    postCollection: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Publication',
        }
    ],
});


const User = mongoose.model('User', userSchema);

module.exports = User;