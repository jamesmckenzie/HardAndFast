
UserMeasurements = new Meteor.Collection("userMeasurements");
Users = new Meteor.Collection("users");

Users.remove({});
Users.insert({firstName: "Bob", lastName: "Watercress"});
Users.insert({firstName: "Ryan", lastName: "Chipmunk"});
Users.insert({firstName: "Rachel", lastName: "Rubens"});


if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to Patient."};

  Template.measurements.users = function () {
    return Users.find({}, {sort: {lastName: 1}})};


  Template.measurements.helpers({
	types: [
		{name : "Blood Pressure", value: 0},
		{name : "Heart Rate", value: 0},
		{name : "Weight", value: 0}
	]
  });

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
  });
}
