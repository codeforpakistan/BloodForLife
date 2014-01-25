sms = new Meteor.Collection("requests");
donor = new Meteor.Collection("donor");

if (Meteor.isClient) {
		Meteor.subscribe("requests");
		Meteor.subscribe("donor");
}

if (Meteor.isServer) {
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
				console.log(donor.find({blood_group:q[0] , city : q[1]}).fetch() , last_bleed : { $lte : gtcurr_date + "-" + curr_month + "-" + curr_year });
				var xml = '<Response><Sms>Thank you for submitting your question!</Sms></Response>';
				return [200, {"Content-Type": "text/xml"}, xml];
		});	
		var exportCSV = function(responseStream){

				var userStream = createStream();
				var fut = new Future();
				var users = {};

				CSV().from(userStream)
				.to(responseStream)
				.transform(function(user, index){
						if(user._id){
								console.log(user);
								//var dateCreated = new Date(user.createdAt);
								//return [user.profile.name, user.emails[0].address, dateCreated.toString()];
						}else
								return user;
				})
				.on('error', function(error){
						log.error('Error streaming CSV export: ', error.message);
				})
				.on('end', function(count){
						responseStream.end();
						fut.ret();
				});

				//Write table headings for CSV to stream.
				userStream.write(["Name", "Email", "Date Created"]);

				users = Users.find({})

				//Pushing each user into the stream, If we could access the MongoDB driver we could
				//convert the Cursor into a stream directly, making this a lot cleaner.
				users.forEach(function (user) {
						userStream.write(user); //Stream transform takes care of cleanup and formatting.
						count += 1;
						if(count >= users.count())
								userStream.end();
				});

				return fut.wait();
		};

		//Creates and returns a Duplex(Read/Write) Node stream
		//Used to pipe users from .find() Cursor into our CSV stream parser.
		var createStream = function(){
				var stream = Npm.require('stream');
				var myStream = new stream.Stream();
				myStream.readable = true;
				myStream.writable = true;
				myStream.write = function (data) {
						myStream.emit('data', data);
						return true; // true means 'yes i am ready for more data now'
						// OR return false and emit('drain') when ready later
				};

				myStream.end = function (data) {
						//Node convention to emit last data with end
						if (arguments.length)
								myStream.write(data);

						// no more writes after end
						myStream.writable = false;
						myStream.emit('end');
				};

				myStream.destroy = function () {
						myStream.writable = false;
				};

				return myStream;
		};
}
