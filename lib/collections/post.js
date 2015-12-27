Posts = new Mongo.Collection('post');

Meteor.methods({
  'clickLike': function (postId) {
    var thisPost = Posts.findOne({_id:postId})
    Posts.upsert({_id:postId}, {$addToSet:{
      'likes' : Meteor.userId()
    }})
    if(Meteor.userId() != thisPost.info.postOwner && !isRedundancy(postId,'like')){
      insertNotify(thisPost,'like')
    }
  },

  'saveFavorite': function (postId) {
    var thisPost = Posts.findOne({_id:postId})
    Posts.upsert({_id:postId}, {$addToSet:{
      'favorites' : Meteor.userId()
    }})
    if(Meteor.userId() != thisPost.info.postOwner && !isRedundancy(postId,'favorite')){
      insertNotify(thisPost,'favorite')
    }
  },

  'newComment': function (postId, comment) {
    var thisPost = Posts.findOne({_id:postId})
    Posts.update({_id:postId}, {$push: {'comments': comment }})
    insertNotify(thisPost,'comment')
  },

  'newCommentLocation': function (locationId,comment) {
    let marker = Markers.findOne({_id:locationId})
    Markers.update({_id:locationId}, {
      $push: {'comments': comment}
    })
  }

})

function isRedundancy(postId,action) {
  var count = Notify.find({postId:postId, notifyFrom:Meteor.userId(), action:action}).count()
  return count > 0 ? true : false
}
function insertNotify(postObj,action) {
  Notify.insert({
    notifyTo : postObj.info.postOwner,
    notifyFrom: Meteor.userId(),
    action: action,
    postId : postObj._id,
    read: false,
    createdAt: new Date()
  })
}
