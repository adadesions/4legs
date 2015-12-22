Template.comment.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  profilePictureForComment : function (id) {
    var user = Meteor.users.findOne({_id:id})
    var img = Images.findOne({_id:user.profile.image._id})
    return img.url()
  }
})
