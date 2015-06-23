

var weka = require('node-weka');
var arff = require('node-arff');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var http = require('http');
var _ = require('underscore')
var async = require('async')
var fs = require('fs')
var exec = require('child_process').exec;

var server = http.createServer()

var app = express();

server.listen(65534, function(){
	 console.log('Server started on port 65534')
})

server.on('request', app)

var wekaModel = undefined;


var browserPath = path.join(__dirname, './browser')
var indexHtmlPath = path.join(__dirname, './browser/html/index.html')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(browserPath));

app.get('/', function(req, res){
	res.sendFile(indexHtmlPath)
})

app.get('/movies', function(req, res){
	console.log("hit route")
	arff.load('movies.arff', function(err, data){
		if(err) return console.error(err)
		//console.log(data)
		res.send(data)
	})
})

app.post('/movies', function(req, res){
	var child;
	console.log("req.body", req.body)
	writeArff(req.body, function(){
		// java -classpath weka.jar weka.classifiers.rules.ZeroR -t ../../../trainingData.arff -T ../../../testData.arff
		child = exec('java -classpath node_modules/node-weka/bin/weka.jar weka.classifiers.rules.OneR -t trainingData.arff -T testData.arff', function(err, stdout, stderr){
			var model = {}
			var column = /.*(?=:)/
			var valReg = /->.*/g
			model.attribute = stdout.match(column)[0]
			var values = stdout.match(valReg)
			console.log("values", values)
			model.val1 = values[0].match(/^\d+|\d+\b|\d+(?=\w)/g)
			model.val2 = values[1].match(/^\d+|\d+\b|\d+(?=\w)/g)
			console.log("model", model)

			// console.log("model.attribute", model.attribute)
			// console.log("stdout", stdout)
			// console.log("stdout type of", typeof(stdout))
			// console.log("stderr", stderr)
			// console.log("err", err)
			res.status(200).send(model)

		}) 
		
	})

	//console.log("req.body", req.body)

})


function writeArff(obj, callback){

	var file = "@relation movies \n\n"+
	'@attribute lead {0, 1} \n'+
	"@attribute genre {0, 1} \n"+
	"@attribute liked {0, 1} \n\n"+
	"@data \n"

	obj.forEach(function(item){
		file += item.lead +", "+ item.genre +", "+ item.liked + " \n" 
	})
	// console.log("file", file)
	fs.writeFile("trainingData.arff", file, function(err){
		if(err) console.log("err", err)
		else console.log("It worked! I think")
		callback()
	})

}
// var options = {
// 	'classifier': 'weka.classifiers.rules.ZeroR',
// 	'params': ''
// }
// var testData = {
// 	outlook : "sunny",
// 	temperature : 80,
// 	humidity: 90,
// 	windy: "TRUE",
// 	play: "no"
// }
//  console.log("weka", weka)

// arff.load('weather.arff', function(err, data){
// 	if(err) {
// 		return console.error(err)
// 	}
// 	console.log("data", data)

// 	weka.classify(data, testData, options, function(err, result){
// 		console.log(result)
// 	})
	
// })


//************

//**************


// child = exec('pwd', function(err, stdout, stderr){
// 	console.log("stdout", stdout)
// 	console.log("stderr", stderr)
// 	console.log("err", err)
// })

//**************
//******************


// weka.classifiers.rules.ZeroR 
// working command from no-weka/bin directory:
// java -classpath weka.jar weka.classifiers.rules.ZeroR -t ../../../weather.arff -T ../../../testData.arff