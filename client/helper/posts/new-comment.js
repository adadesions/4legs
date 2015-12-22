Template.newComment.helpers({
  username : function () {
    return Meteor.user().username || Meteor.user().profile.name
  },
  profilePicture : function (id) {
    var img = Images.findOne({_id:id})
    return img.url()
  }
})

Template.newComment.events({
  'keypress #newComment' : function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
      var postId = $(e.target).attr("name"),
          comment = {
            commentOwnerId : Meteor.user()._id,
            commentOwner: Meteor.user().username || Meteor.user().profile.name,
            commentBody: $(e.target).val(),
            commentAt : new Date()
          }
      Meteor.call('newComment',postId,comment)
      $(e.target).val('')
    }
  }

})
