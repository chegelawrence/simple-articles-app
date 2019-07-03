const express = require("express");
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const config = require('./config/database')
const passport = require('passport')
mongoose.connect(config.database,{ useNewUrlParser: true })
let db = mongoose.connection
const app = express();
const port = 3000
//check connection
db.once('open',function(){
	console.log('Connected to MongoDB')
})
//check for db errros
db.on('error',function(err){
	console.log(err)
})

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')

//body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json());
//set public folder
app.use(express.static(path.join(__dirname,'public')))
//Express session middleware
app.use(session({
  secret: 'lawzy',
  resave: true,
  saveUninitialized: true,
}))

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware



//Init models
 let Article = require('./models/article')

//passport config

require('./config/passport')(passport)
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//global user variable for all urls
app.get('*',function(req,res,next){
	res.locals.user = req.user || null;
	next()
})
//home route
app.get('/',function(req,res){

	Article.find({},function(err,articles){
		if(err){
			console.log(err)
		}else{
				res.render("index",{
				//title:"KnowledgeBase",
				articles:articles
			})
		}
	})
	
})

//Route file
let articles = require('./routes/articles')
app.use('/articles',articles)
let users = require('./routes/users')
app.use('/users',users)


app.listen(port,()=>console.log(`Server listening on port ${port}!`))