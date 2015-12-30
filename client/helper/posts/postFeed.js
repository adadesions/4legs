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
    let type = Template.currentData() ? Template.currentData().type : false,
        highlight = Template.currentData() ? Template.currentData().highlight : false

    if(highlight) return Posts.find({highlight:true})

    if(type === 'favorite'){ //For favorite
        return Posts.find({'favorites': Meteor.userId()}, {sort: {'info.createdAt': -1}})
    }
    else if(type){ //For specific type
      if(Session.get('adminPetType')){
        let petType = Session.get('adminPetType')
        return Posts.find({catagory : type, 'info.petType': petType}, {sort: {'info.createdAt': -1}})
      }
      return Posts.find({catagory : type}, {sort: {'info.createdAt': -1}})
    }

    if(userId) { //For Profile
      var byUserId = Posts.find({'info.postOwner': userId}, {sort: {'info.createdAt': -1}})
      // console.log(byUserId.fetch());
      return byUserId.count() > 0 ? byUserId : Posts.find({_id:userId})
    }
    else
      return Posts.find({catagory : 'newsfeed', highlight:false}, {sort: {'info.createdAt': -1}})
  },
  isNoPosts : function (userId) {
    if(userId)
      return Posts.find({'info.postOwner': userId}).count() !== 0 ? false : Posts.find({_id:userId}).count() !== 0 ? false : true
    else true
  },
  showDeleteBtn: function () {
    let isHighlight = Session.get('superuserContainer') === 'adminHighlight'
    return Meteor.user().profile.asAdmin.loggedIn && !isHighlight
  },
  showHighlightBtn: function () {
    return Session.get('superuserContainer') === 'adminHighlight'
  },
  isHighlight: function (postId) {
    return Posts.findOne({_id:postId}).highlight ? 'checked' : ''
  },
  postHighlight: function () {
    let highlight = Template.currentData() ? Template.currentData().highlight : false
    return highlight ? 'post-highlight' : ''
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
  'click .admin-delete-btn': function (e) {
    let id = $(e.target).attr('id'),
        picId = Posts.findOne({_id:id}).img._id
    let confirm = new Confirmation({
      message: "Are you sure to delete this post?",
      title: "Confirmation",
      cancelText: "Cancel",
      okText: "Confirm",
      success: true // wether the button should be green or red
    }, function (ok) {
        if(ok) {
          Posts.remove({_id:id}, function (err) {
            if(err){
              throw err
              toastr.error('Can not delete this post right now')
            }
            else{
              console.log(picId);
              Meteor.call('removePicture', picId)
              toastr.success('The post has deleted by admin')
            }
          })
        }
    })
  },
  'click .admin-highlight-btn, click input': function (e) {
    let id = $(e.target).attr('id'),
        curHighlight = Posts.findOne({highlight:true})
    if(curHighlight){
      Posts.update({_id:curHighlight._id},{$set:{highlight:false}})
    }
    else{
      Posts.upsert({_id:id},{$set:{highlight:true}})
    }
  }
})
