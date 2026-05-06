const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// this is to handle the CORS error when the frontend and backend are running on different ports
// CORS stands for Cross-Origin Resource Sharing, and it is a security feature implemented by web browsers to prevent malicious websites from making requests to a different domain than the one that served the original web page. When a web page makes a request to a different domain, the browser will block the request unless the server explicitly allows it through CORS headers. By setting the appropriate CORS headers in the response, we can allow cross-origin requests from specific domains or allow all domains to access our API. In this case, we are allowing all domains to access our API by setting the 'Access-Control-Allow-Origin' header to '*'.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);


app.listen(8080);