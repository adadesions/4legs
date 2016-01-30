Template.addFollow.helpers({
  followList: function () {
    let followingList = Meteor.user().profile.following
    followingList = followingList.map( data => data.followingId)
    followingList.push(Meteor.userId())
    console.log(followingList);
    return Meteor.users.find({
      'profile.following.followingId' : {
        $nin: followingList
      }
    })
  }
})
