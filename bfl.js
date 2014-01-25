var requests = new Meteor.Collection("requests");

if (Meteor.isClient) {
		Template.hello.greeting = function () {
				return "Welcome to bfl.";
		};

		Template.hello.events({
				'click input' : function () {
						// template data, if any, is available in 'this'
						if (typeof console !== 'undefined')
								console.log("You pressed the button");
				}
		});
		Meteor.subscribe("requests");
}

if (Meteor.isServer) {
		Meteor.publish("requests");
		Meteor.startup(function () {
				// code to run on server at startup
				twilio = Twilio('ACd539ed39721dd42d527664c8f83404de', '34fc16b33ad93e415c06e63c735a8142');
		});
		Meteor.methods({
				'sendSms' : function (arg1, arg2){
						twilio.sendSms({
								to:'+923335568858', // Any number Twilio can deliver to
								from: '+14807257674', // A number you bought from Twilio and can use for outbound communication
								body: 'word to your mother.' // body of the SMS message
						}, function(err, responseData) { //this function is executed when a response is received from Twilio
								if (!err) { 
										console.log(responseData.from); // outputs "+14506667788"
										console.log(responseData.body); // outputs "word to your mother."
								}else{
										console.log(err);	
								}
						});

				}
		});

		Meteor.Router.add('/api/sms', 'POST', function() {
				var rawIn = this.request.body;
				if (Object.prototype.toString.call(rawIn) == "[object Object]") {
						requests.insert(rawIn);
				}

				var requests = {};
				if (rawIn.Body) {
						requests.inputQuestion = rawIn.Body;
						requests.source = "sms";
				} else if (rawIn.TranscriptionText) {
						requests.inputQuestion = rawIn.TranscriptionText;
						requests.source = "voicemail";
				} else {
						return;
				}
				requests.inputName = rawIn.From;
				requests.to = rawIn.To;
				
				requests.insert(requests);

				var rawIn = this.request.body;
				var xml = '<Response><Sms>Thank you for submitting your question!</Sms></Response>';
				return [200, {"Content-Type": "text/xml"}, xml];
		});	

}
