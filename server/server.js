var express=require('express');
var bodyParser =require('body-parser');
var app= express();
var mongoose = require('mongoose');
const morgan = require('morgan');
const session =require('express-session');
const dotenv = require('dotenv');
dotenv.config();

var port = process.env.PORT || 5000;

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}));
//middlware for otherzation from server to client: To privent cors() errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );  
    next();
})


//Conect to DB
const url= process.env.DB_CONECT;
const options ={ useNewUrlParser: true, useCreateIndex: true}

mongoose 
  .connect(url, options)
  .then(()=> console.log("MongoDB connected"))
  .catch(err => console.log(err))


//Routs Middlewares
var Users = require('./routes/Users');
var Apartments = require('./routes/Apartments');
var Requests = require('./routes/Requests');
var Posts = require('./routes/Posts');
var Profile =require('./routes/Profile');
app.use('/users', Users);
app.use('/profile', Profile);
app.use('/apartments', Apartments);
app.use('/requests', Requests);
app.use('/posts', Posts);

//Listening on port 
app.listen(port, () => console.log('Server is running on port ', port));


  /*Errors langh for this project : 
  * 400 -  validation errors
  * 401 - some thing went with data
  * 402 - alrady exists
  * 404 - not found
  */