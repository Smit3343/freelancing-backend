const moongoose = require("mongoose");
const config = require('./config');

const connectToMongoDb = () => {
    moongoose.connect(config.MONGO_URI,
        {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
        }).then(() => {
            console.log("MongoDb Connected Sucessfully!");
        }).catch((err) => {
            console.log(err);
        })
}
module.exports = connectToMongoDb;
