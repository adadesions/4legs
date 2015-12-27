Template.registerHelper('profilePicture', function (id) {
  var user = Meteor.users.findOne({_id:id})
  if(user.profile.image){
    let img = Images.findOne({_id:user.profile.image._id})
    return img.url()
  }
  return '/images/object/2-signup/profile-img.png'
})

Template.registerHelper('username', function (id) {
  var user = Meteor.users.findOne({_id:id})
  return user.username
})

Template.registerHelper('checkAuthority', function (id) {
  return Meteor.userId() === id ? true : false
})
