Session.set('aboutMeContainer', 'showProfile')

Template.aboutMe.helpers({
  aboutMeContainer : function () {
    var state = Session.get('aboutMeContainer')
    var profileOwner = $('#profile-username').text()
    if(state === 'editProfile'){
      if(profileOwner === Meteor.user().username) return Session.get('aboutMeContainer')
      else {
        Session.set('aboutMeContainer', 'showProfile')
        return Session.get('aboutMeContainer')
      }
    }
    return Session.get('aboutMeContainer')
  },
  showAllFollowing : function (id) {
    let following = Meteor.users.findOne({_id:id}),
        ids = following.profile.following,
        followingSet = _.map(ids, function (data) {
          return Meteor.users.findOne({_id:data.followingId})
        })
        return followingSet
  },
  showAllFollowers : function (id) {
    let followers = Meteor.users.findOne({_id:id}),
        ids = followers.profile.followers,
        followerSet = _.map(ids, function (data) {
          return Meteor.users.findOne({_id:data.followerId})
        })
        return followerSet
  }
})
Template.aboutMe.events({
  'click .my-btn-edit' : function (e) {Session.set('aboutMeContainer','editProfile')},
  'mouseenter .badge-img': function (e) {
    console.log("Enter");
  }
})

Template.aboutMe.onRendered(function () {
  $('.head-badge-popup').popup()
  $('.badge-medal').popup()
})
/////////editProfile////////////
Template.editProfile.rendered=function() {
    $('#birthday').datepicker();
}

Template.editProfile.helpers({
  topices : function () {
    var t = Topices.findOne()
    return t.data
  },
  isTheValue : function (value) {
    var interesting = Meteor.user().profile.topics
    return _.contains(interesting, value)
  }
})

Template.editProfile.events({
  'click #update-btn': function (e) {
    e.preventDefault()
    var username = $('[name=username]').val(),
        birthday = $('[name=birthday]').val(),
        topics = $('[name=topics]:checked').map(function () {return this.value}).get(),
        newData = {
          username : username,
          birthday : birthday,
          topics : topics
        }
    Meteor.call('updateProfile',newData)
    Session.set('aboutMeContainer', 'showProfile')
  },

  'click #cancel-btn' : function (e) {
    Session.set('aboutMeContainer', 'showProfile')
  },

  'change [name=upload]': function (e) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          Meteor.call('updateProfilePicture', fileObj._id)
          toastr.success('Upload succeeded!')
        }
      })
    })
  }

})
