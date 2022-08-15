const moongoose = require("mongoose");
const config = require('./config');

const connectToMongoDb = () => {
    moongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error) => {
        if (error) {
            console.error(error.message);
        }
        else {
            console.log("mongodb connected  successfully");
        }
    })
}
module.exports = connectToMongoDb;
