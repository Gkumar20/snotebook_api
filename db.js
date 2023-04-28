const mongoose = require('mongoose');

const URI = process.env.mongoURI;

//there is build connectiona and checking connection error and return promise as then and catch
const connectToMongo = () => {
  mongoose.connect(URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Successfully connected");
    })
    .catch((err) => {
      console.log("Unable to connect to MongoDB. Error: " + err);
    }
    )
}

module.exports = connectToMongo;