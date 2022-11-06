const router = require('express').Router();
const publicationController = require('./controllers/publicationController');
const userController = require('./controllers/userController');

router.use('/data/publication', publicationController);
router.use('/user', userController);


module.exports = router;