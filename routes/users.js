'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
//Init models
 let User = require('../models/user')

 //Register form

 router.get('/register',function(req,res){
 	res.render('register',{
 		title:'Create account'
 	})
 })

//add new user
 router.post('/register',function(req,res){
 	const name = req.body.name
 	const email = req.body.email
 	const username = req.body.username
 	const password = req.body.password
 	const confirmpassword = req.body.confirm_password
 	//compare passwords
 	if(password === confirmpassword){
 		//new user
 		let newUser = User({
 			name:name,
 			email:email,
 			username:username,
 			password:password
 		})	
 		//generate password hash
 		bcrypt.genSalt(10,function(err,salt){
 			bcrypt.hash(newUser.password,salt,function(err,hash){
 				if(err){
 					console.log(err)
 				}
 				newUser.password = hash
 				newUser.save(function(err){
 					if(err){
 						console.log(err)
 						return
 					}else{
 						req.flash('success','You are now registered and can log in')
 						res.redirect('/users/login')
 					}
 				})
 			})
 		})
 	}else{
 		req.flash('danger','The passwords do not match')
 		res.redirect('/')
 	}
 	

 })
 router.get('/login',function(req,res){
 	res.render('login',{
 		title:'Sign In'
 	})
 })

 //login process
 router.post('/login',function(req,res,next){
 	passport.authenticate( 'local',{
 		successRedirect:'/',
 		failureRedirect:'/users/login',
 		failureFlash:true
 	})(req,res,next)
 })

 //logout

 router.get('/logout',function(req,res){
 	req.logout()
 	req.flash('success','You are now logged out')
 	res.redirect('/users/login')
 })

 module.exports = router