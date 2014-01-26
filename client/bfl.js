sms = new Meteor.Collection("requests");
donor = new Meteor.Collection("donor");

Meteor.subscribe("requests");
Meteor.subscribe("donor");


Meteor.Router.add({
	'/search': function(){
		var query = this.querystring.split("&");
		if(query.length >= 2){
			var city = query[1].split("=");
			var group = query[0].split("=");
			Session.set('results', donor.find({blood_group:group[1], city:city[1]}).fetch());
			Session.set('params', this.querystring);
		}else{
			Session.set('results',null);
			Session.set('params', this.querystring);
		}
		$('html,body').animate({scrollTop:0}, 150);
		return 'search';	
	},
	'/' : function(){
		$('html,body').animate({scrollTop:0}, 150);
		return 'home';
	},
	'/login': function() {
		$('html,body').animate({scrollTop:0}, 150);
		return 'login';
	},
	'/register': function() {
		$('html,body').animate({scrollTop:0}, 150);
		return 'register';
	},
	'*': 'not_found'
});

Template.search.events({
	'click #search' : function(e,t){
		e.preventDefault();
		Meteor.Router.to('/search?group='+$("#group option:selected").val()+"&city="+$("#city option:selected").val());
	}
});
Template.search.helpers({
	result : function() {
		return Session.get('results');
	},
	isCurrentcity : function(string){
		var query = Session.get('params').split("&");
		var city = query[1].split("=");
		if(string == city[1]){
		   return 'selected';
		}

	},	
	isCurrentgroup : function(string){
		var query = Session.get('params').split("&");
		var group = query[0].split("=");
		if(string == group[1]){
		   return 'selected';
		}

	},
});
Template.home.helpers({
	notlogggedIn : function() {
		if(Meteor.user() == null){
			return 1;
		}
	},
	loggedIn : function(){
		if(Meteor.user() != null){
			return 1;
		}
	},
	
});
Template.home.events({
	'click #search' : function(e,t){
		e.preventDefault();
		Meteor.Router.to('/search?group='+$("#group option:selected").val()+"&city="+$("#city option:selected").val());
	}
});
Template.search.rendered = function(){
	$('table').dataTable(); 
};
Template.register.events({
	'click #register' : function(e,t){
		e.preventDefault();
		var email = t.find('#email').value
			, password = t.find('#password').value;

		var Donor = {
			blood_group : t.find('#blood_group option:selected').value,
			//title : t.find('#title option:selected').value,
			full_name : t.find('#name').value,
			gender : t.find('#sex input[type=radio]:checked').value,
			dob : t.find('#dob').value,
			email : t.find('#email').value,
			cell : t.find('#cell').value,
			phone : t.find('#home').value,
			address : t.find('#address').value,
			city : t.find('#city option:selected').value,
		}
		console.log(Donor);
		var uid = donor.insert(Donor);
		//Trim and validate the input

			Accounts.createUser({email: email, password : password, profile : {did: uid, name: full_name}}, function(err){
				if (err) {
					// Inform the user that account creation failed
				} else {
					// Success. Account has been created and the user
					// has logged in successfully. 
					Meteor.Router.to('/');
				}

			});
			return false;
	}
});
Handlebars.registerHelper("calcAge", function (dateString, options) {
	var birthday = +new Date(dateString);
	return humanise(~~((Date.now() - birthday) / (86400000)));
});
function humanise (diff) {
	var str = '';
	var values = {
		' year': 365, 
	};
	for (var x in values) {
			var amount = Math.floor(diff / values[x]);
			if (amount >= 1) {
				str += amount + x + (amount > 1 ? 's' : '') + ' ';
				diff -= amount * values[x];
			}
		}
		return str;
	};

