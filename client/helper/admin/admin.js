Template.admin.helpers({
  getEmail: function () {
    return Meteor.user().emails[0].address
  }
})

Template.admin.events({
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
        Meteor.users.update({_id:Meteor.userId()},{
          $set: {
            'profile.asAdmin': {
              loggedIn: true,
              loggedInAt: new Date()
            }
          }
        })
        Router.go('superuser');
      }
    })
  }
})

//adminLayout
Template.adminLayout.events({
  'click #adminLogOut': function () {
    Meteor.users.update({_id:Meteor.userId()}, {$set: {'profile.asAdmin.loggedIn': false}})
    Router.go('newsfeed')
  }
})

//Superuser
Template.superuser.onCreated(function () {
  Session.set('superuserContainer','adminNews')
})
Template.superuser.helpers({
  superuserContainer: function () { return Session.get('superuserContainer')}
})

//adminNews
Template.adminNews.onCreated(function () {
  Session.set('adminNewsContainer','about-pet')
})
Template.adminNews.helpers({
  adminNewsContainer: function () {return Session.get('adminNewsContainer')}
})
