const express = require('express');
const {InitializeDatabase} = require('./config/database');
const {errorHandler} = require('./middlewares/errorHandler');
const routes = require('./router');
const cors = require('cors');
const { auth } = require('./middlewares/authMiddleware');

const app = express();
const port = 3030;



app.use(express.urlencoded({extended: true}));
app.use(auth);
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errorHandler);


InitializeDatabase()
    .then(() => {
        app.listen(port, () => console.log('Server is listening on port 3030'));
        console.log('DB is ready');
    })
    .catch(err => console.log(err));
