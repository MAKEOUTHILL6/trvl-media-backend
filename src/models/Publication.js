const mongoose = require('mongoose');


const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
       
    },
    postImage: {
        type: String,
    },
    location: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    user: {
        type: String,
        required: true,
    },
});


const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;