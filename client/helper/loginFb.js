Template.loginFb.events({
    'click #facebook-login': function(event) {
      Meteor.loginWithFacebook({}, function(err){
          if(err) throw new Meteor.Error("Facebook login failed");
      });
      Router.go('register');
    },

    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});
