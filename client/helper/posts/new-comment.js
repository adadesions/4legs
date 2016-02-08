Template.newComment.helpers({
  username : function () {
    return Meteor.user().username || Meteor.user().profile.name
  }
})

Template.newComment.events({
  'keypress #newComment' : function (e) {
    if(e.keyCode === 13 && $(e.target).val() !== ''){
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
