Template.login.events({
  'click .btn-myLogin': function (e) {
    e.preventDefault();
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(username, password, function (err) {
      if (err) {
          toastr.error("Your Username or Password is incorrect")
          throw new Meteor.Error("login failed");
      }
      else{
        Router.go('newsfeed');
      }
    });
  },

  'keypress .loginForm': function (e) {
    e.keyCode === 13 ? $('.btn-myLogin').trigger('click') : ''
  }

})
