 const mongoose = require('mongoose');
 const mongoURI = "mongodb://0.0.0.0:27017/snotebook" //connected at this localhost


 //there is build connectiona and checking connection error and return promise as then and catch
 const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(() => {     
      console.log("Successfully connected");
    })
    .catch((err) => {
      console.log("Unable to connect to MongoDB. Error: " + err);
    }
    )
  }

 module.exports = connectToMongo;