configureFacebook = function(config) {
   ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: config.clientId,
        secret: config.secret
    });
};

configureGoogle = function(config) {
   ServiceConfiguration.configurations.insert({
        service: "google",
        clientId: config.clientId,
	loginStyle: "popup",
        secret: config.secret
    });
};

// set the settings object with meteor --settings private/settings-local.json
var facebookConfig = Meteor.settings.facebook;
var googleConfig = Meteor.settings.google;

if(facebookConfig) {
    console.log('Got settings for facebook', facebookConfig)

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.remove({
        service: "google"
    });
    configureFacebook(facebookConfig);
    configureGoogle(googleConfig);

}