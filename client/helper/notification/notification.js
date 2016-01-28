///////////// notification
Template.notification.helpers({
  unreadNotify: function () {
    return Notify.find({notifyTo:Meteor.userId(), read:false}, {sort: {createdAt: -1}})
  },
  readNotify: function () {
    return Notify.find({notifyTo:Meteor.userId(), read:true}, {sort: {createdAt: -1}, limit: 10},)
  }
})
Template.notification.events({
  'click .as-read': function (e) {
    Meteor.call('setAsRead')
  }
})

///////////// notifyItem
Template.notifyItem.helpers({
  takeAction: function (action) {
    var complete = {
      like : "likes your post",
      comment: "commented on your post",
      share: "shared your post",
      post: "wrote a new post",
      favorite: "saved your post as favorite"
    }
    return complete[action]
  },
  enhanceTime: function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  isRead: function (data) {
    return data === true ? 'read' : 'unread'
  }
})

Template.notifyItem.events({
  'click .notify-item': function (e) {
    var id = $(e.target).attr('id')
    Notify.update({_id:id}, {
      $set: {read: true}
    })
  },
  'click .notify-body': function (e) {
    var id = $(e.target).parent().attr('id')
    Notify.update({_id:id}, {
      $set: {read: true}
    })
  }
})
