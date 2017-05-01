var alexa = require('alexa-app');
var http = require('http');

// Create a skill
var iss = new alexa.app('iss');

function issLocation(req, res) {
	var options = {
		hostname: 'api.open-notify.org',
		path: '/iss-now.json',
		method: 'GET'
	};

	return new Promise((resolve, reject) => {
		const request = http.request(options, (res) => {
			var data = '';	
			res
				.on('data', (chunk) => data += chunk)
				.on('end', () => resolve(data));
		});
		request.on('error', (err) => reject({ message: err }));
		request.end();
	})
	.then((data) => {
		data = JSON.parse(data);
		var content = 'The ISS is at longitude ' + data.iss_position.longitude +
			' and lattitude ' + data.iss_position.latitude;
		res.say(content);
	})
	.catch((reason) => res.say('Alexa App Error: ' + reason.message));
};

function issLat(req, res) {
	var options = {
		hostname: 'api.open-notify.org',
		path: '/iss-now.json',
		method: 'GET'
	};

	return new Promise((resolve, reject) => {
		const request = http.request(options, (res) => {
			var data = '';	
			res
				.on('data', (chunk) => data += chunk)
				.on('end', () => resolve(data));
		});
		request.on('error', (err) => reject({ message: err }));
		request.end();
	})
	.then((data) => {
		data = JSON.parse(data);
		var content = 'ISS latitude is ' + data.iss_position.latitude;
		res.say(content);
	})
	.catch((reason) => res.say('Alexa App Error: ' + reason.message));
};

function issLong(req, res) {
	var options = {
		hostname: 'api.open-notify.org',
		path: '/iss-now.json',
		method: 'GET'
	};

	return new Promise((resolve, reject) => {
		const request = http.request(options, (res) => {
			var data = '';	
			res
				.on('data', (chunk) => data += chunk)
				.on('end', () => resolve(data));
		});
		request.on('error', (err) => reject({ message: err }));
		request.end();
	})
	.then((data) => {
		data = JSON.parse(data);
		var content = 'ISS longitude is ' + data.iss_position.longitude;
		res.say(content);
	})
	.catch((reason) => res.say('Alexa App Error: ' + reason.message));
};

// Default intent
iss.launch(issLocation);

var latOpts = {
	"slots": {},
	"utterances": [ "latitude" ]
};

iss.intent('latitude', latOpts, issLat);

var longOpts = {
	"slots": {},
	"utterances": [ "longitude" ]
};

iss.intent('longitude', longOpts, issLong);

// connect the alexa-app to AWS Lambda
exports.handler = iss.lambda();
// develop locally in an the alexa-app-server
// module.exports = iss;
