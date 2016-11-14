var express = require('express');
var valid = require('url-valid');
var shortid = require('shortid');
var mongoose = require('mongoose');

var app = new express();
app.use(express.static('public'));

var counter = 1;

mongoose.connect('mongodb://enio:url@ds039421.mlab.com:39421/url');

mongoose.connection.once('open', function(err){
	if(err) console.log(err);
	else { 
		var snippetSchema = mongoose.Schema({
			urls: {type:String},
			shortUrl: {type:Number}		
		});
		
		var Url = mongoose.model('Url', snippetSchema);
		
		app.get('/:url', function(req, res){
			var url = 'http://' + req.params.url;
			console.log(url);
	
			if(isNaN(Number(url))){
				valid(url, function(err, valid){
					if(err) throw err;
					else console.log(valid);
				});
		
				Url.create({urls: url, shortUrl: counter}, function(err, result){
					if (err) console.log('Url does not exist');
					else {
						console.log('url created');
						res.send(result.counter);
					}
				});
				
				counter += 1;
		
				Url.findOne({urls: url}, function(err, result){
					if(err || !result) console.log(err);
					else res.send(result.shortUrl);		
				});	
			}
			else {
	
				Url.findOne({urls: url}, function(err, result){
					if(err) console.log(err);
					else if(result === null) res.send('Wrong id');
					console.log(result);
				});
			}
		});
	}
});
		
app.listen(process.env.PORT || 7000);