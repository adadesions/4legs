Meteor.methods({
  'setAsRead': function () {
    Notify.update({notifyTo: Meteor.userId(), read:false}, {
      $set: {read:true}
    }, {multi:true})
  }
})
