var alexa = require('alexa-app');

// Create a skill

var hello = new alexa.app('hello');

// Default intent
hello.launch((req, res) => {
	res.say('Ask me to say hi!');

	// keep session open
	// continue to listen for interacton, leave stream open
	res.shouldEndSession(true);
});

var intentOpts = {
	"slots": {},
	"utterances": [ "{to |} {say|speak|tell me} {hi|hello|howdy|hithere|hiya|hiya|hey|hay|heya}" ]
};

// Create an intent called hello
hello.intent('hello', intentOpts, (req, res) => res.say('WiTNY!').shouldEndSession(false));

// connect the alexa-app to AWS Lambda
exports.handler = hello.lambda();