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
