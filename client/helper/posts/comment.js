Template.comment.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  isVetComment: function (userId) {
    let user = Meteor.users.findOne({_id:userId})
    if(user) return user.profile.vetInfo.verified    
  }
})
