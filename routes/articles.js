const express = require('express')
const router = express.Router()
//Init models
let Article = require('../models/article')
let User = require('../models/user')


//Add article


router.get('/add',ensureAuthenticated,function(req,res){
	res.render("add_article",{
		title:'Add Article'
	})
})

//Add article
router.post('/add',function(req,res){
	let article = new Article()
	article.title = req.body.title
	article.author = req.user._id
	article.body = req.body.body
	article.save(function(err){
		if(err){
			console.log(err)
			return
		}else{
			req.flash('success','Article added')
			res.redirect('/')
		}
	})
})
//load article edit form
router.get('/edit/:id',ensureAuthenticated,function(req,res){
	Article.findById(req.params.id,function(err,article){
		if(err){
			console.log(err)
		}else{
			
			if(article.author != req.user._id){
				req.flash('danger','Not authorized')
				res.redirect('/')
			}
			res.render('edit_article',{
				article:article
			})
		}
	})
})
//edit article
router.post('/edit/:id',function(req,res){
	let article = {}
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	let query = {_id:req.params.id}
	Article.updateOne(query,article,function(err){
		if(err){
			console.log(err)
			return
		}else{
			req.flash('success','Article updated')
			res.redirect('/')
		}
	})
})
//delete article
router.delete('/delete/:id',function(req,res){
	if(!req.user._id){
		res.status(500).send()
	}
	let query = {_id:req.params.id}
	Article.findById(query,function(err,article){
		if(article.author != req.user._id){
			res.status(500).send()
		}else{
			Article.deleteOne(query,function(err){
				if(err){
					console.log(err)
				}
				res.send('Success')
		
			})
		}
	})
	
})
router.get('/:id',function(req,res){
		Article.findById(req.params.id,function(err,article){
			User.findById(article.author,function(err,user){
				res.render('article',{
					article:article,
					author:user.name
				})
			})


			
	})



	

})

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		//move to the next middleware
		next()
	}else{
		req.flash('danger','Please log in')
		res.redirect('/users/login')
	}
}

module.exports = router