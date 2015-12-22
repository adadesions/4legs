Template.navigator.events({
  'click #navigator-logout' : function (e) {
    Meteor.logout(function(err){
        if (err) {
            throw new Meteor.Error("Logout failed");
        }
        Router.go('login');
    })
  },
  'click #notification': function (e) {
    // $('.notify-badge').text("")
  }
})

Template.navigator.helpers({
  isActive : function (myLocation) {
    if(myLocation === 'more'){
      let pathSet = ['profile','favoritePlaces','favoriteTopics', 'addFollow', 'feedback'],
          has = _.contains(pathSet, Router.current().route.getName())
      if(has) return 'active'
    }
    return Router.current().route.getName() === myLocation ? 'active' : ""
  },
  notifyBadge: function () {
    return Notify.find({notifyTo:Meteor.userId(), read:false}).count()
  }
})
