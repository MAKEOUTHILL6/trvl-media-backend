const Publication = require('../models/Publication');
const User = require('../models/User');

exports.getAll = () => Publication.find();

exports.createPublication = async ({title, location, description, ownerId, user}, postImageId) => {

    if(title === ''){
        throw{
            message: 'Title field is required!'
        }
    } else {
        if(title.length <= 1){
            throw{
                message: 'Title must be longer than 1 character!'
            }
        }
    };


    if (location === ''){
        throw{
            message: 'Location field is required!'
        }
    };

    if (description === ''){
        throw{
            message: 'Description field is required!'
        }
    } else {
        if(description.length <= 10){
            throw{
                message: 'Description must be longer than 10 characters!'
            }
        }
    };

    if(postImageId === ''){
        throw{
            message: 'Image field is required!'
        }
    };


    const publication = await Publication.create({
        title,
        location,
        description,
        ownerId,
        user,
        postImage: postImageId,
    });

    const currentUser = await User.findById(publication.ownerId);

    currentUser.postCollection.push(publication._id);

    await currentUser.save();

    return publication;
};

exports.getOne = (id) => Publication.findById(id);

exports.updatePublication = (id, data) => Publication.findByIdAndUpdate(id, data, { runValidators: true });

exports.delete = async (id) => {
    const publication = await Publication.findByIdAndDelete(id);

    const user = await User.findById(publication.ownerId);

    let poppedIndex = user.postCollection.indexOf(publication._id);

    if (user.postCollection) {
        const collection = user.postCollection;

        collection.pop(poppedIndex);
    }

    await user.save();

    return publication;

};


exports.getSearched = (title) => Publication.find({title});