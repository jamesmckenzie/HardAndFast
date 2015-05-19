
UserMeasurements = new Meteor.Collection("userMeasurements");


if (Meteor.isClient) {

  Template.measurements.users = function () {
    return Users.find({}, {sort: {lastName: 1}})};


  Template.measurements.helpers({
	types: [
		{name : "Blood Pressure", value: 0},
		{name : "Heart Rate", value: 0},
		{name : "Weight", value: 0}
	]
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
