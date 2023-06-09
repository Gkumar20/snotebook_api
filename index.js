require('dotenv').config();
const express = require('express');
const { json } = require('express');
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
const connectToMongo = require('./db');


//add cors 
app.use(cors())



//connected to mongo-database
connectToMongo();
  

//this used as a middleware to send the json as response when using routes
app.use(express.json())
//this is use routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.listen(port, () => {
  console.log(`sNotebook listening on port ${port}`)
})