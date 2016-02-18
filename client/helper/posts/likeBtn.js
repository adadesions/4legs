Template.likeBtn.onRendered(function () {
  // let theId = $('.like-hover').attr('id')
  // $('.like-hover').popup({
  //   inline: true,
  //   target: '.like-hover',
  //   position : 'top left'
  // })
})

Template.likeBtn.helpers({
  queryLiked: function (likeArray) {
    let users = likeArray.map( id => Meteor.users.findOne({_id:id}).username)
    return users
  }
})

// Template.likeBtn.events({
//   'mouseenter .like-hover': function (e) {
//     $('.like-hover').popup({
//       inline: true,
//       target: '.like-hover',
//       position : 'top left'
//     }).popup('show')
//
//   }
// })
