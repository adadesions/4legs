Session.setDefault('profileContainer', 'timeline')
Session.setDefault('followingBtn', false)

Template.profile.helpers({
  profileContainer : function() {return Session.get('profileContainer')},
  isActive : function (myLocation) {
    return Session.equals('profileContainer',myLocation) ? 'profile-menu-active' : ""
  },
  isFollowing : function (fid) {
    Meteor.call('checkFollowing',fid,function (err,res) {
      Session.set('followingBtn', res)
    })
    return Session.get('followingBtn')
  }
})

Template.profile.events({
  'click #timeline' : function (e) {Session.set('profileContainer', 'timeline')},
  'click #aboutme' : function (e) {Session.set('profileContainer', 'aboutMe')},
  'click #mypets' : function (e) {Session.set('profileContainer', 'myPets')},
  'click .my-btn-follow' : function (e) {
    let id = $('.my-btn-follow').attr('id'),
        person = Meteor.users.findOne({_id:id})
    Meteor.call('addFollower', id)
    Meteor.call('addFollowing', id, function (err) {
      if(err) toastr.error("Sorry, you can't follow this person right now")
      else{
        Session.set('followingBtn', true)
        toastr.success("You're following "+person.username)
      }
    })

  },
  'click .my-btn-unfollow' : function (e) {
    let id = $(e.target).attr('id'),
        person = Meteor.users.findOne({_id:id})
    Meteor.call('unFollower',id)
    Meteor.call('unFollowing', id, function (err) {
      if(err) toastr.error("Sorry, you can't unfollow "+person.username)
      else{
        Session.set('followingBtn', false)
        toastr.success("Unfollowing "+person.username)
      }
    })
  }
})

Template.profile.onRendered(function () {
  //SEO
  Meta.setTitle("Profile")
})
