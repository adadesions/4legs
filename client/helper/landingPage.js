Template.landingPage.onRendered(function () {
  $('#loginLandingPage')
  .popup({
    popup : $('.login-landing.popup'),
    on    : 'click',
    position : 'bottom left'
  }),

  $('.forget-password')
  .popup({
    popup : $('.forget-password-landing.popup'),
    on    : 'click',
    position : 'top left'
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
  },

  'click #forgetPasswordLandingButton':function (e) {
    e.preventDefault();
    let loginId = $('[name=usernameForget]').val();
    let emailId = $('[name=emailForget]').val();
    let users = Meteor.users.find().fetch()
    console.log(users)
    users.map( u => {
      if (loginId === u.username) {
        Accounts.forgotPassword(emailId)
        console.log(check)
      }else{
        console.log(u.username)
        toastr.error("Your Username or Email is incorrect")
        throw new Meteor.Error("no data");
      }
    })
  }
})
