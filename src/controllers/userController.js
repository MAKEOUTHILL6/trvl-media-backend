const router = require('express').Router();
const userService = require('../services/userService');
const { upload } = require('../middlewares/upload');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
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


let profileImage = null;

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


router.post('/upload', upload.single('profileImage'), async (req, res) => {
    profileImage = req.file
});


router.post('/register', isGuest, async (req, res, next) => {
    let imageId = profileImage.id
    const { data } = req.body;

    try {

        const token = await userService.register(data, imageId);
        res.json(token);

    } catch (error) {
        next(error);
    }
});

router.post('/login', isGuest, async (req, res, next) => {
    const data = req.body;

    try {

        const token = await userService.login(data);
        res.json(token);

    } catch (error) {
        next(error);
    }
});


router.get('/:userId', async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await userService.getUser(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
});


router.post('/:userId', isAuth, async (req, res, next) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const user = await userService.updateUser(userId, data);
        res.json(user);
    } catch (error) {
        next(error);
    }
});


router.get('/logout', isAuth, (req, res) => {
    res.json(true);
});


module.exports = router;