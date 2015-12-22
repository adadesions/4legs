Template.postFeed.helpers({
  username : function () {
    return Meteor.user().username || Meteor.user().profile.name
  },
  checkLen : function (ele) {
    return ele.length > 100 ? true : false;
  },
  matchUserId : function (userId) {
    var user = Meteor.users.findOne({_id:userId})
    return user.username || user.profile.name
  },
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  },
  findPicture : function (id) {
    var img = Images.findOne({_id:id})
    return img.url()
  },
  posts : function (userId) {
    var type = Template.currentData() ? Template.currentData().type : false
    if(type === 'favorite'){
        return Posts.find({'favorites': Meteor.userId()}, {sort: {'info.createdAt': -1}})
    }
    else if(type){
      return Posts.find({catagory : type}, {sort: {'info.createdAt': -1}})
    }
    if(userId) {
      var byUserId = Posts.find({'info.postOwner': userId}, {sort: {'info.createdAt': -1}})
      // console.log(byUserId.fetch());
      return byUserId.count() > 0 ? byUserId : Posts.find({_id:userId})
    }
    else return Posts.find({catagory : 'newsfeed'}, {sort: {'info.createdAt': -1}})
  },
  isNoPosts : function (userId) {
    if(userId)
      return Posts.find({'info.postOwner': userId}).count() !== 0 ? false : Posts.find({_id:userId}).count() !== 0 ? false : true
    else true
  }

})

Template.postFeed.events({
  'click .icon-comment' : function (e) {
    var postId = '#cs-'+$(e.target).attr('id'),
        section = $(postId+'.comment-section')
    if(section.hasClass("hidden")){
      section.slideDown(300, function () {
        section.removeClass('hidden')
      })
    }
    else{
      section.slideUp(500, function () {
        section.addClass('hidden')
      })
    }
  },

  'click .icon-like' : function (e) {
    var id = $(e.target).attr('id')
    Meteor.call("clickLike", id)
  },

  'click .icon-favorite' : function (e) {
    var id = $(e.target).attr('id')
    Meteor.call("saveFavorite", id, function (err) {
      if(err){
        toastr.error("Please, try again we can't save this post")
      }
      else{
        toastr.success('Saved this post as favorite')
      }
    })
  },

  'ready document' : function (e) {
    e.preventDefault()
    $('.comment-section').hide()
  }
})
