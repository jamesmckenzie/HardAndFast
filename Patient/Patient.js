UserMeasurements = new Meteor.Collection("userMeasurements");
ChatMessages = new Meteor.Collection("chatMessages");

if (Meteor.isClient) {

	Template.tempUserID.helpers({
		tempUserID : Meteor.userId()
	});

	Template.measurements.helpers({
		fields: [
			{ name: "bloodPressure", label: "Blood Pressure", value: 0 },
			{ name: "heartRate", label: "Heart Rate", value: 0 },
			{ name: "weight", label: "Weight", value: 0 }
		],
		
		measurements: function () {
			return UserMeasurements.find({userId: Meteor.userId()}, {sort: {date: -1}});
		}
	});
	
	Template.measurements.events({
		'submit .submit-measurements': function(event) {
			UserMeasurements.insert({
				userId: Meteor.userId(),
				date: new Date(),
				bloodPressure: event.target.bloodPressure.value,
				heartRate: event.target.heartRate.value,
				weight: event.target.weight.value
			});
			
			event.target.bloodPressure.value = '0';
			event.target.heartRate.value = '0';
			event.target.weight.value = '0';
			
			return false;
		}
	});
	
	Template.chat.helpers({	
		messages: function () {
			return ChatMessages.find({fromUserId: Meteor.userId()}, {sort: {date: 1}});
		}
	});
	
	Template.chat.events({
		'submit .chat-controls': function(event) {
			if(!event.target.message.value) {
				return false;
			}
			
			ChatMessages.insert({
				date: new Date(),
				fromUserId: Meteor.userId(),
				toUserId: 123,
				text: event.target.message.value
			});
			
			event.target.message.value = '';
			
			var messagesPane = document.getElementsByClassName('chat-messages')[0];
			messagesPane.scrollTop = messagesPane.scrollHeight;
			
			return false;
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
