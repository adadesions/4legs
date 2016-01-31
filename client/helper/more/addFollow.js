Template.addFollow.helpers({
  followList: function () {
    let followingList = Meteor.user().profile.following
    followingList = followingList.map( data => data.followingId)
    followingList.push(Meteor.userId())
    return Meteor.users.find({
      '_id' : {
        $nin: followingList
      }
    }, {sort: {username: 1}})
  }
})

Template.addFollow.onRendered(function () {
  $('img.avatar').css({
    'width': '6em',
    'height': '6em'
  })
})
