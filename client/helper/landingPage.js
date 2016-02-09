Template.landingPage.onRendered(function () {
  $('#loginLandingPage')
  .popup({
    popup : $('.custom.popup'),
    on    : 'click',
    position : 'bottom right'
  })
})

Template.landingPage.events({
  'click #loginLandingButton': function (e) {
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

  'keypress .login-landing-form': function (e) {
    e.keyCode === 13 ? $('#loginLandingButton').trigger('click') : ''
  }
})
