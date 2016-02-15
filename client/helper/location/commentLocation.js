Template.commentLocation.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  profilePictureForComment : function (id) {
    var user = Meteor.users.findOne({_id:id})
    var img = Images.findOne({_id:user.profile.image._id})
    return img.url()
  },
  showButton: function (commentId) {
    return Meteor.userId() === commentId || Meteor.user.profile.privileged ? true : false
  }
})

Template.commentLocation.events({
  'click #removeComment': function (e) {
    let markerId = Session.get('selectedLocationId'),
        commentId = $(e.target).data('commentid')
    console.log(commentId);
    Markers.update({_id: markerId}, {$pull: {comments: {commentId: commentId}}})
  }
})
