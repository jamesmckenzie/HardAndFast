UserMeasurements = new Meteor.Collection("userMeasurements");
ChatMessages = new Meteor.Collection("chatMessages");
DoctorsPatients = new Meteor.Collection("doctorPatients");

if (Meteor.isClient) {

	<!-- DOCTOR SECTION -->

	Template.drPatients.helpers({
		loggedInDoctor: function  () { 
			if (Meteor.user()) {
				return Meteor.user().profile.name;
			}
		}
	});

	Template.body.events({
	    "submit .new-patient": function (event) {

	    var patientID = event.target.patientID.value;

        if (Meteor.users.findOne({_id: patientID})) {
        	if (!DoctorsPatients.findOne({doctorID: Meteor.userId(), patientID: patientID}))
        	{
	            DoctorsPatients.insert({
	            	doctorID:  Meteor.userId(),
	              	patientID: patientID,
	              	createdAt: new Date()
	            });
	            console.log("inserted " + patientID);
            }
            else
            {
            	console.log("already exists " + patientID)
            }
        } else {
          throw new Meteor.Error(403, "patient ID" + patientID + " does not exist!");
        }

        event.target.patientID.value = "";

        return false;
      }
    });

	Template.tempAllUsers.helpers({   
	    patientsLinked: function () {
	      return DoctorsPatients.find({doctorID : Meteor.userId()}, {sort: {_id: -1}});
	    },
	    allUsers: function () {
	      return Meteor.users.find({}, {sort: {_id: -1}});
	    },
	    selectedClass: function(){
	      var patientId = this.patientID;
	      var selectedPatient = Session.get('selectedPatient');
	      if(patientId == selectedPatient){
	          return "doctorPatientselected"
	      }
	    },
	    hidden: function () {
	      if (Session.get('selectedPatient') == undefined) {return "hidden"};
	      return "";
	    },
	    userMeasurements : function () {
	    	if (Session.get('selectedPatient') == undefined) 
	    		return UserMeasurements.find({userId: "fakeID"}, {sort: {date: -1}});
			else
			{
				var selectedPatient = Session.get('selectedPatient');
				return UserMeasurements.find({userId: selectedPatient}, {sort: {date: -1}});
			}
	    },
		selectedPatient: function () {
			return Session.get('selectedPatient');
		}
	});

	Template.tempAllUsers.events({
	    'click .myPatients': function(){
	      var patientId = this.patientID;
	      Session.set('selectedPatient', patientId);
	    }
  	});

	<!-- END DOCTOR SECTION -->

	<!-- PATIENT SECTION -->

	Template.tempUserID.helpers({
		tempUserID : function () { 
			if (Meteor.userId()) {
				return Meteor.userId() 
			}
		},
		loggedInPatient: function  () { 
			if (Meteor.user()) {
				return Meteor.user().profile.name;
			}
		}
	});

	Template.doctor.helpers({
		doctor: function() {
			return DoctorsPatients.findOne({patientID: Meteor.userId()});
		}
	});

	Template.tempBody.helpers({   
	    isPatient: function () { return Session.get('isPatient'); }
	});

	Template.tempBody.events({
		"click .patientCheck": function () {
		   Session.set('isPatient', !Session.get('isPatient'));
		   console.log(Session.get('isPatient'));
		},
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
	<!-- END PATIENT SECTION -->
	
	Template.chat.helpers({	
		messages: function () {
			if(this.recipient) {
				return ChatMessages.find({fromUserId: {$in: [Meteor.userId(), this.recipient]}, toUserId: {$in: [Meteor.userId(), this.recipient]}}, {sort: {date: 1}});
			}
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
				toUserId: this.recipient,
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
