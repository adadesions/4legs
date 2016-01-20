Template.registerHelper('profilePicture', function (id) {
  let user = Meteor.users.findOne({_id:id})
  if(user && user.profile.image._id){
    let img = Images.findOne({_id:user.profile.image._id})
    return img.url()
  }
  return '/images/object/2-signup/profile-img.png'
})

Template.registerHelper('getUsername', function (id) {
  var user = Meteor.users.findOne({_id:id})
  return user.username
})

Template.registerHelper('checkAuthority', function (id) {
  return Meteor.userId() === id ? true : false
})

Template.registerHelper('getImage', function (id) {
  return Images.findOne({_id:id}).url()
})

Template.registerHelper('enhanceTime', function (time) {
  var adjTime = moment(time);
  return adjTime.fromNow();
})

Template.registerHelper('matchUserId', function (userId) {
  var user = Meteor.users.findOne({_id:userId})
  return user.username || user.profile.name
})

Template.registerHelper('findPicture', function (id) {
  var img = Images.findOne({_id:id})
  return img.url()
})

Template.registerHelper('limitLength', function (msg) {
  return msg.slice(0,75)
})

Template.registerHelper('checkLen', function (msg) {
    return msg.charAt(75) ? true : false;
})

Template.registerHelper('isLiked', function (postId) {
  return Posts.find({_id:postId, likes:Meteor.userId()}).count() > 0 ? 'red' : ''
})
