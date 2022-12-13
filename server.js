require('dotenv').config();
const express = require('express');
const projectRoute = require('./route/project-route');
const fileUpload = require('express-fileupload')
const userRoute = require('./route/user-route');
const bidRoute = require('./route/bid-route');
var config = require('./config');
const mongoose = require('mongoose');
const connectToMongoDb = require('./db');

connectToMongoDb();

const app = express();
const cors = require('cors')({ origin: true });
app.use(cors);
app.use(fileUpload());
app.use(express.static('uploads'));

mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

app.use(express.json())


app.use('/api', projectRoute);
app.use('/user', userRoute);
app.use('/bid', bidRoute);


app.listen(config.LISTEN_PORT, () => {
  console.log('Connected to port ' + config.LISTEN_PORT)
})
