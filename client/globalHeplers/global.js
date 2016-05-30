Template.registerHelper('profilePicture', function (_id) {
  let user = Meteor.users.findOne({_id:_id})

  if(user){
    if(user.services.facebook){
      let fbId = user.services.facebook.id
      return `https://graph.facebook.com/${fbId}/picture/?type=large`
    }
    else if(user.profile.image._id){
      let img = Images.findOne({_id:user.profile.image._id})
      return img.url()
    }
  }
  return '/images/object/2-signup/profile-img.png'

})

Template.registerHelper('fbProfilePicture', function (fbId) {
  if(Meteor.user().services.facebook)
    return `https://graph.facebook.com/${fbId}/picture/?type=large`
  else
    return '/images/object/2-signup/profile-img.png'
})

Template.registerHelper('getUsername', function (id) {
  var user = Meteor.users.findOne({_id:id})
  return user ? user.username : ''
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
