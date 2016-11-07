var express = require('express');
var valid = require('url-valid');
var shortid = require('shortid');
var mongoose = require('mongoose');

var app = new express();

mongoose.connect('mongodb://enio:enio@ds147267.mlab.com:47267/url', function(err){
	if(err) throw err;
	
});

mongoose.connection.once('open', function(err){
	if(err){
		console.log(err);
	}else{
		var snippetSchema = mongoose.Schema({
			urls: {type:String},
			shortUrl: {type:Number}		
		});
		
		var Url = mongoose.model('Url', snippetSchema);
	}
});

app.use(express.static('public'));

app.get('/:url', function(req, res){
	var url = 'http://' + req.params.url;
	console.log(url);
	
	if(!isNaN(Number(url))){
		valid(url, function(err, valid){
			if(err) throw err;
			console.log(valid);
		});
			
		
		var id = Math.floor(Math.random() * 9999 + 1);
		console.log(id);
		
		Url.create({urls: url, shortUrl: id}, function(err, result){
			if(err){
				console.log('Url does not exist');
			}else{
				console.log('url created');
				res.json(id);
			}
		});
		
		Url.findOne({urls: url}, function(err, result){
			if(err){
				console.log(err);
			}
			
			res.json(result.shortUrl);
		});
		

		
	}else{
	
		Url.findOne({urls: url}, function(err, result){
			if(err){
				console.log(err);
			}
			if(result === null){
				res.json('Wrong id');
			}
			res.redirect(result.urls);
		});
	}
	
});
		

	

app.listen(process.env.PORT || 7000);