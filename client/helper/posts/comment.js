Template.comment.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  profilePictureForComment : function (id) {
    var user = Meteor.users.findOne({_id:id})
    if(user.profile.image){      
      return Images.findOne({_id:user.profile.image._id}).url()
    }
    return '/images/object/2-signup/profile-img.png'


  }
})
