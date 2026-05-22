const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
    cb(
        null,
        new Date().toISOString().replace(/:/g, '-') +
        '-' +
        file.originalname
    );
}
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        )
    {
        cb(null, true);
    } else {
        cb(null, false);
    }
};



// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage:fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname, 'images')));



// this is to handle the CORS error when the frontend and backend are running on different ports
// CORS stands for Cross-Origin Resource Sharing, and it is a security feature implemented by web browsers to prevent malicious websites from making requests to a different domain than the one that served the original web page. When a web page makes a request to a different domain, the browser will block the request unless the server explicitly allows it through CORS headers. By setting the appropriate CORS headers in the response, we can allow cross-origin requests from specific domains or allow all domains to access our API. In this case, we are allowing all domains to access our API by setting the 'Access-Control-Allow-Origin' header to '*'.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);



// general exception handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });  
});

mongoose.connect(
    'mongodb+srv://ebaashkair248_db_user:oNWt1jLlHVGFvShS@cluster0.dvavvdj.mongodb.net/?appName=Cluster0'
).then(result => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('Client connected');
    })
}).catch(err => {
    console.log(err);
})