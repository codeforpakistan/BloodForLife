sms = new Meteor.Collection("requests");
donor = new Meteor.Collection("donor");

Meteor.startup(function () {
	// code to run on server at startup
	Meteor.publish("requests");
	Meteor.publish("donor");
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

	},
	'addDonor' : function(arg1){
		var Donor = {
			bg : 'A+',
			title : 'Mr.',
			fn : 'Shakeel Shafiq',
			gender : 'male',
			dob : '01-01-1980',
			email : 'shakeel.shafique@gmail.com',
			cell : '03335568858',
			phone : '0512225587',
			address : 'Islamabad',
			city : 'Islamabad',
			other : 'NA'
		}
		donor.insert(Donor);
	}
});

Meteor.Router.add('/api/sms', 'POST', function() {
	var rawIn = this.request.body;
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		sms.insert(rawIn);
	}
	var string = this.request.body.Body;
	var q = string.split(" ");
	var d = new Date();
	d.setMonth(-6);
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	var res = donor.find({blood_group:q[0] , city : q[1]}, {limit :5}).fetch();
	var xml = '<Response><Sms>'+string+' Donors: ';
	for(i in res){
		xml += res[i].full_name+' '+res[i].cell+String.fromCharCode(10);
	}
	xml += '</Sms></Response>';
	return [200, {"Content-Type": "text/xml"}, xml];
});	
