UserMeasurements = new Meteor.Collection("userMeasurements");
ChatMessages = new Meteor.Collection("chatMessages");
DoctorsPatients = new Meteor.Collection("doctorPatients");

if (Meteor.isClient) {

	<!-- DOCTOR SECTION -->

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
	    }
	});
	<!-- END DOCTOR SECTION -->

	<!-- PATIENT SECTION -->

	Template.tempUserID.helpers({
		tempUserID : function () { 
			if (Meteor.userId()) {
				return Meteor.userId() 
			}
		}
	});

	// Session.set('isPatient', false)

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
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
