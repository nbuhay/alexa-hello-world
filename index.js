var alexa = require('alexa-app');

// Create a skill
var hello = new alexa.app('hello');

// Default intent
//   keep session open
//   continue to listen for interacton, leave stream open
hello.launch((req, res) => res.say('Testing Cornell Tech connectivity.  Ask me to say hi!').shouldEndSession(false));

var intentOpts = {
	"slots": {},
	"utterances": [ "{to |} {say|speak|tell me} {hi|hello|howdy|hithere|hiya|hiya|hey|hay|heya}" ]
};

// Create an intent called hello
hello.intent('hello', intentOpts, (req, res) => res.say('Build-a-Thon connectivity test succeeded!  Nice job!'));

// connect the alexa-app to AWS Lambda
exports.handler = hello.lambda();