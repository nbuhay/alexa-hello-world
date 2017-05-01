var alexa = require('alexa-app');
var creds = require('./credentials').api; // locally stored JSON object with user creds
var http = require('follow-redirects').https;
const welcome = "Hi!  Try out an api call for pokeapi, nasa, discogs, or spotify!";

// Create a skill
var api = new alexa.app('api');

// make a HTTP request using Node.js
function httpRequest(options) {
	// a Promise is JavaScript and is good practice for asynchronous RESTful calls
	//   the HTTP call can either pass successfully or fail from an error
	//   success goes to resolve().then and fails go to catch()
	return new Promise((resolve, reject) => {
		const request = http.request(options, (res) => {
			// TOP of callback definition
			// need to setup what the HTTP request does with data 
			var data = '';	// store incoming data from a HTTP request to an API. initially empty
			res
				// parse incoming data from the call, add it to the data string
				.on('data', (chunk) => data += chunk)
				// all incoming data is here, nothing bad happened, resolve() the data
				//   where's the .then()?  It's down in our api functions in the form httpRequest(options).then
				.on('end', () => resolve(data));
			// BOTTOM of callback definition
		});
		// in case of any error during HTTP call, reject with an error message
		request.on('error', (err) => reject({ message: err }));
		// execute the HTTP request defined above
		request.end();
	})
	// send any rejected message back to callee function
	.catch((reason) => { throw Error(reason.message) });
}

// calls an API to get pokemon data
function pokeapi(req, res) {
	// set parameter specific to pokeapi
	var pokemonIndex = 25;
	// setup where HTTP request will be made. a pokemon API in this case
	var options = {
		protocol: 'https:',
		hostname: 'pokeapi.co',
		path: `/api/v2/pokemon/${pokemonIndex}`,
		method: 'GET'
	};

	// call the httpRequest to make a HTTP request against pokeapi
	//   pass in options to give the HTTP request everything it needs to make the api call
	return httpRequest(options)
		.then((data) => {
			// parse and format returned data, then and make Alexa speak it
			data = JSON.parse(data);
			var content = `Go ${data.name}!`;
			res.say(JSON.stringify(content));
		})
		// make Alexa speak up for any error. not best UX. works for development
		.catch((reason) => res.say('Alexa App Error: Pokeapi: ' + reason.message));
}

// Uses a nasa api_key
//   get your own - https://api.nasa.gov/index.html#apply-for-an-api-key
function nasa(req, res) {
	var options = {
		protocol: 'https:',
		hostname: 'api.nasa.gov',
		// injects nasa_api key from cred module
		path: `/planetary/apod?api_key=${creds.nasa.api_key}`,
		method: 'GET'
	};

	return httpRequest(options)
		.then((data) => res.say(JSON.parse(data).title))
		.catch((reason) => res.say('Alexa App Error: NASA: ' + reason.message));
}

function discogs(req, res) {
	var art = 'nirvana';
	var pp = 5;
	var options = {
		protocol: 'https:',
		hostname: 'api.discogs.com',
		path: `/database/search?artist=${art}&per_page=${pp}&key=${creds.discogs.key}&secret=${creds.discogs.secret_key}`,
		headers: {
			'User-Agent': 'BuhayAlexaTest'
		}
	};

	return httpRequest(options)
		.then((data) => {
			data = JSON.parse(data);
			var content = `Some albums are ${data.results[0].title}, ${data.results[1].title}, and ${data.results[2].title}.`;
			res.say(content);
		})
		.catch((reason) => res.say('Alexa App Error: Discogs: ' + reason.message));
}

function spotify(req, res) {
	var spotifyAlbumId = "3lFioPGhn7x5Y3H3YbPV83"; // got by right-clicking an album in Spotify
	var options = {
		host: 'api.spotify.com',
		path: `/v1/albums/${spotifyAlbumId}`
	};

	return httpRequest(options)
		.then((data) => {
			data = JSON.parse(data);
			var content = `The album is ${data.name} by ${data.artists[0].name}`;
			res.say(content);
		})
		.catch((reason) => res.say('Alexa App Error: Spotify: ' + reason.message));
}


// Default intent
api.launch((req, res) => res.say(welcome));

// Pokeapi intent
var pokeapiIntOpts = { "utterances": [ "{who's that pokemon|pokemon|i choose you|pokedex}" ] };
// give intent name, utterances, and api function to call 
api.intent('pokeapi', pokeapiIntOpts, pokeapi);

// nasa intent
var nasaIntOpts = { "utterances": [ "{tell me about|what's the} {nasa} {picture|daily picture|title|}" ] };
api.intent('nasa', nasaIntOpts, nasa);

// discogs intent
var discogsIntOpts = { "utterances": [ "{tell me|} {about|which|what|} {nirvana|records} {are available|}" ] };
api.intent('discogs', discogsIntOpts, discogs);

// spotify intent
var spotifyIntOpts = { "utterances": [ "{what|which} {spotify|bowie} {album|record|music} {listen|available|}" ] };
api.intent('spotify', spotifyIntOpts, spotify);

// connect the alexa-app to AWS Lambda
// exports.handler = api.lambda();
// develop locally in an the alexa-app-server
module.exports = api;
