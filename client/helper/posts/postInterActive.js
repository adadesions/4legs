Template.likeBtn.events({
  'click .icon-like': function (e) {
    var id = $(e.target).attr('id')
    Meteor.call("clickLike", id)
  }
})
Template.likeBtn.helpers({
  isLiked: function(postId){
      return Posts.find({_id:postId, likes:Meteor.userId()}).count() > 0 ? 'red' : ''
  }
})

// Template.commentBtn.events({
//   'click .comment-icon': function (e) {
//     let sel = '#post-'+$(e.target).attr('id'),
//         $ele = $(sel).children('.feed').children('.event')
//     if($ele.hasClass('show-comment'))
//       $ele.addClass('hidden').removeClass('show-comment')
//     else
//       $ele.removeClass('hidden').addClass('show-comment')
//   }
// })
