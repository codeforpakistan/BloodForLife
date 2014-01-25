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
}

if (Meteor.isServer) {
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
	Router.map(function () {
			this.route('twilioSms', {
					where: 'server',
					action: function () {
							this.response.writeHeader(200, {"Content-Type": "text/xml"});  
							this.response.write('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Hi!</Message></Response>');  
							this.response.end();
							// some special server side properties are available here
					}
			});
	});
}
