Template.postFeed.helpers({
  username : function () {
    return Meteor.user().username || Meteor.user().profile.name
  },
  posts : function () {
    let type = Template.currentData() ? Template.currentData().type : false,
        highlight = Template.currentData() ? Template.currentData().highlight : false,
        userId = Template.currentData() ? Template.currentData().userId : false

    if(highlight) return Posts.find({highlight:true})

    if(type === 'favorite'){ //For favorite
        return Posts.find({'favorites': Meteor.userId()}, {sort: {'info.createdAt': -1}})
    }
    else if(type === 'pop'){
      let allPost = Posts.find({catagory : 'newsfeed'},{sort: {'info.createdAt': -1}, limit: 3 }).fetch()
      return allPost
    }
    else if(type === 'publicTopics'){
      let allPost = Posts.find({catagory : 'topics'},{sort: {'info.createdAt': -1}, limit: 6 }).fetch()
      return allPost
    }
    else if(type){ //For specific type
      if(Session.get('adminPetType')){
        let petType = Session.get('adminPetType')
        return Posts.find({catagory : type, 'info.petType': petType}, {sort: {'info.createdAt': -1}})
      }
      return Posts.find({catagory : type}, {sort: {'info.createdAt': -1}})
    }

    if(userId) { //For Profile
      var byUserId = Posts.find({ $or: [{'info.postOwner': userId}, {'shares.sharedBy': Meteor.userId()}] }, {sort: {'info.createdAt': -1}}).fetch()
      return byUserId.length > 0 ? byUserId : Posts.find({_id:userId})
    }
    else{
      let myFollowing = Meteor.user().profile.following
      myFollowing = _.pluck(myFollowing, 'followingId')
      myFollowing.push(Meteor.userId())

      //Got all from same interesting
      let myInteresting = Meteor.user().profile.topics,
          allUsers = Meteor.users.find().fetch()

      let sameInteresting = _.filter(allUsers, u => {
        return _.intersection(u.profile.topics, myInteresting) !== []
      })
      sameInteresting = _.pluck(sameInteresting, '_id')

      //Merge Ids
      let readyToUseId = _.uniq(myFollowing.concat(sameInteresting))
      return Posts.find({'info.postOwner': {$in: readyToUseId}}, {sort: {'info.createdAt': -1}}).fetch()

    }
  },
  isNoPosts : function (userId) {
    if(userId)
      return Posts.find({'info.postOwner': userId}).count() !== 0 ? false : Posts.find({_id:userId}).count() !== 0 ? false : true
    else true
  },
  showDeleteBtn: function () {
    let isHighlight = Session.get('superuserContainer') === 'adminHighlight'
    if(Meteor.user().profile.asAdmin)
      return Meteor.user().profile.asAdmin.loggedIn && !isHighlight
  },
  showHighlightBtn: function () {
    return Session.get('superuserContainer') === 'adminHighlight'
  },
  postHighlight: function () {
    let highlight = Template.currentData() ? Template.currentData().highlight : false
    return highlight ? 'post-highlight' : ''
  },
  numOfCol: function () {
    return Template.currentData().col ? Template.currentData().col : 'one'
  },
  limitComment: function (comments) {
    return comments.length > 3 ? comments.slice(comments.length-3,comments.length) : comments
  },
  isVet: function (userId) {
    let user = Meteor.users.findOne({_id:userId})
    return user.profile.vetInfo.verified
  },
  isSos: function (catagory) {
    return _.contains(catagory,'sos')
  },
  isHelped: function (obj) {
    let state = [
      {color: 'red', content: 'Need Help!'},
      {color: 'green', content: 'Helped^^'}
    ]
    if(!obj.helped) return state[0]
    else return state[1]
  },
  showPostOption: function (postId) {
    if(Meteor.user()){
      if(Meteor.user().profile.privileged) return true

      let post = Posts.findOne({_id:postId})
      if(post.info.postOwner === Meteor.userId()) return true
    }
    return false       
  },
  isSosPost: function (postId) {
    let post = Posts.findOne({_id:postId}).catagory,
        isSos = _.contains(post, 'sos')
    return isSos
  }
})

Template.postFeed.events({
  'click .icon-favorite' : function (e) {
    var id = $(e.target).attr('id')
    Meteor.call("saveFavorite", id, function (err) {
      if(err){
        toastr.error("Please, try again we can't save this post")
      }
      else{
        // toastr.success('Saved this post as favorite')
      }
    })
  },
  'click .admin-delete-btn': function (e) {
    let id = $(e.target).attr('id'),
        picId = Posts.findOne({_id:id}).img._id

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
  },
  'click #deletePost': function (e) {
    let postId = $(e.target).data('id'),
        picId = Posts.findOne({_id:postId}).img._id

    let confirm = new Confirmation({
      message: "Are you sure to delete this post?",
      title: "Confirmation",
      cancelText: "Cancel",
      okText: "Confirm",
      success: false
    }, function (ok) {
        if(ok) {
          Posts.remove({_id:postId}, function (err) {
            if(err){
              throw err
              toastr.error('Can not delete this post right now')
            }
            else{
              Meteor.call('removePicture', picId)
              toastr.success('The post has deleted')
            }
          })
        }
    })
  },
  'click #helped': function (e) {
    let postId = $(e.target).data('id')

    let confirm = new Confirmation({
      message: "Are you sure this post was helped?",
      title: "Confirmation",
      cancelText: "Cancel",
      okText: "Confirm",
      success: true
    }, function (ok) {
        if(ok) {
          Posts.update({_id:postId}, {$set: {helped:true}} , function (err) {
            if(err){
              throw err
              toastr.error('Can not confirm on this post right now')
            }
            else{
              toastr.success('The post was helped')
            }
          })
        }
    })
  }
})
