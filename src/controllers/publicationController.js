const router = require('express').Router();
const publicationService = require('../services/publicationService');
const { upload } = require('../middlewares/upload');
const { isAuth } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

const conn = mongoose.createConnection(process.env.DB_URL, {
    useNewUrlParser: true,
    UseUnifiedTopology: true,
})
let gfs;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db), {
        bucketName: 'uploads'
    };
})

let postImage = null;

router.get('/image/:imageId', (req, res) => {
    const imageId = req.params.imageId;
    if (!imageId || imageId === 'undefined') return res.status(400).send('no image id');
    const _id = new mongoose.Types.ObjectId(imageId);
    gfs.find({ _id }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(400).send('no files send')
        }
        gfs.openDownloadStream(_id).pipe(res)
    });
});

router.post('/upload', upload.single('postImage'), async (req, res) => {
    postImage = req.file.id;
});


router.get('/', async (req, res, next) => {

    try {
        const publications = await publicationService.getAll();

        res.json(publications);
    } catch (error) {
        next(error);
    }

});


router.post('/', isAuth, async (req, res, next) => {
    const postImageId = postImage;
    const publication = req.body;

    try {

        const createdPubication = await publicationService.createPublication(publication, postImageId);
        res.json(createdPubication);

    } catch (error) {
        next(error);
    }
});



router.post('/search', async (req, res, next) => {
    const { title } = req.body;
    try {
        const publications = await publicationService.getSearched(title);
        res.json(publications)
    } catch (error) {
        next(error);
    }
});


router.get('/:id', async (req, res, next) => {
    const itemId = req.params.id;

    try {
        const publication = await publicationService.getOne(itemId);
        res.json(publication);
    } catch (error) {
        next(error);
    }
});


router.put('/:id', isAuth, async (req, res, next) => {
    const itemId = req.params.id
    const updateData = req.body;

    try {
        const updatedItem = await publicationService.updatePublication(itemId, updateData);
        res.json(updatedItem);

    } catch (error) {
        next(error);
    }
});


router.delete('/:id', isAuth, async (req, res, next) => {
    const itemId = req.params.id;

    try {
        const deletedItem = await publicationService.delete(itemId);
        res.json(deletedItem);
    } catch (error) {
        next(error)
    }
});


module.exports = router;