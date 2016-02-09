Template.comment.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  isVet: function (userId) {
    let user = Meteor.users.findOne({_id:userId})
    console.log(user.profile.vetInfo.isVet);
    return user.profile.vetInfo.verified
  }
})
