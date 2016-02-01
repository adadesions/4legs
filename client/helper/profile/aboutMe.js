Template.aboutMe.events({
  'click .link-seeall-follower': function (e) {
    $('.ui.modal.follower')
      .modal('show')
  },

  'click .link-seeall-following': function (e) {
    $('.ui.modal.following')
      .modal('show')
  }
})
