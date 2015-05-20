if (Meteor.isClient) {

    Template.body.events({
        "submit .new-patient": function (event) {

        var patientID = event.target.patientID.value;

        if (Meteor.users.findOne({_id: patientID})) {
            DoctorsPatients.insert({
              patientID: patientID,
              createdAt: new Date() 
            });
        } else {
          throw new Meteor.Error(403, "patient ID" + patientID + " does not exist!");
        }

        event.target.patientID.value = "";

        return false;
      }
    });

  Template.tempAllUsers.helpers({   
    allUsers: function () {
      return Meteor.users.find({}, {sort: {_id: -1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
