Template.navigator.onCreated(function () {
  let barkSound = new Audio('/sound/bark.wav'),
      query = Notify.find({notifyTo:Meteor.userId(), read:false})
  Tracker.autorun(function () {
    query.observe({
      added: function(newDoc){
        barkSound.play()
      }
    })
  })
})

Template.navigator.events({
  'click #navigator-logout' : function (e) {
    Meteor.logout(function(err){
        if (err) {
            throw new Meteor.Error("Logout failed");
        }
        Router.go('/');
    })
  },
  'click #notification': function (e) {
    // $('.notify-badge').text("")
  },

  'click a' : function (e) {
    $('#navbar-main').addClass('collapsed').attr('aria-expanded',false)
    $('.navbar-collapse').removeClass('in').attr('aria-expanded',false)
  }
})

Template.navigator.helpers({
  isActive : function (myLocation) {
    if(myLocation === 'more'){
      let pathSet = ['profile','favoritePlace','FavoriteTopics', 'addFollow', 'feedback'],
          has = _.contains(pathSet, Router.current().route.getName())
      if(has) return 'active'
    }
    return Router.current().route.getName() === myLocation ? 'active' : ''
  },
  notifyBadge: function () {
    return Notify.find({notifyTo:Meteor.userId(), read:false}).count()
  }
})
