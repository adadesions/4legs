Template.likeBtn.events({
  'click .icon-like': function (e) {
    var id = $(e.target).attr('id')
    Meteor.call("clickLike", id)
  }
})
Template.likeBtn.helpers({
  isLiked: function(postId){
      return Posts.find({_id:postId, likes:Meteor.userId()}).count() > 0 ? '/images/icon/like-icon.png' : '/images/icon/like-icon-w.png'
  }
})

Template.commentBtn.helpers({
  isComment: function (postId) {
      return Posts.find({_id:postId, 'comments.commentOwnerId':Meteor.userId()}).count() > 0 ? '/images/icon/comment-icon.png' : '/images/icon/comment-icon-w.png'
  }
})

Template.favoriteBtn.helpers({
  isFavorite: function (id) {
    let  query = Posts.findOne({_id:id})
    if(query)
      return Posts.find({_id:id, favorites:Meteor.userId()}).count() > 0 ? '/images/icon/favorite-icon.png' : '/images/icon/favorite-icon-w.png'
    else
      return Markers.find({_id:id, asFavorite:Meteor.userId()}).count() > 0 ? '/images/icon/favorite-icon.png' : '/images/icon/favorite-icon-w.png'
  }
})


Template.shareBtn.helpers({
  isShare: function (postId) {
    return Posts.find({_id:postId, shares:Meteor.userId()}).count() > 0 ? '/images/icon/share-icon.png' : '/images/icon/share-icon-w.png'
  },

})
Template.shareBtn.events({
  'click .share-to-timeline': function (e) {
    let postId = $(e.target).attr('id')
    Posts.update({_id:postId}, {$addToSet: {
        shares: {
          sharedBy: Meteor.userId(),
          sharedAt: new Date()
        }
      }
    })
  }
})

//FB Share
UI.registerHelper('shareOnFacebookLink', function(postId) {
  return `https://www.facebook.com/sharer/sharer.php?&u=${window.location.origin}/post/${postId}`
});
