Template.login.events({
  'click .btn-myLogin': function (e) {
    e.preventDefault();
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(username, password, function (err) {
      if (err) {
          throw new Meteor.Error("login failed");
      }
      else{
        Router.go('newsfeed');
      }
    });

  }

})
