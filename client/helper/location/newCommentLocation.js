Template.newCommentLocation.helpers({
  username : function () {
    return Meteor.user().username || Meteor.user().profile.name
  }
})

Template.newCommentLocation.events({
  'keypress #newComment' : function (e) {
    if(e.keyCode === 13){
      e.preventDefault()
      var locationId = $(e.target).attr("name"),
          comment = {
            commentOwnerId : Meteor.user()._id,
            commentOwner: Meteor.user().username || Meteor.user().profile.name,
            commentBody: $(e.target).val(),
            createdAt : new Date()
          }
      Meteor.call('newCommentLocation',locationId,comment)
      $(e.target).val('')
    }
  }

})
