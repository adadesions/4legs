Template.registerHelper('profilePicture', function (id) {
  var user = Meteor.users.findOne({_id:id})
  var img = Images.findOne({_id:user.profile.image._id})  
  return img !== null ? img.url() : "/images/profile/default_start.jpg"
})

Template.registerHelper('username', function (id) {
  var user = Meteor.users.findOne({_id:id})
  return user.username
})

Template.registerHelper('checkAuthority', function (id) {
  return Meteor.userId() === id ? true : false
})
