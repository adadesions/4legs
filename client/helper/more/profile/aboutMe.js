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
  show9Following : function (id) {
    let following = Meteor.users.findOne({_id:id}),
        ids = following.profile.following,
        followingSet = _.map(ids, function (data) {
          return Meteor.users.findOne({_id:data.followingId})
        })
    return followingSet.length > 9 ? followingSet.slice(0,9) : followingSet
  },
  show9Follower : function (id) {
    let followers = Meteor.users.findOne({_id:id}),
        ids = followers.profile.followers,
        followerSet = _.map(ids, function (data) {
          return Meteor.users.findOne({_id:data.followerId})
        })
    return followerSet.length > 9 ? followerSet.slice(0,9) : followerSet
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
        followerSet = ids.map(data => Meteor.users.findOne({_id:data.followerId}))
    return followerSet
  },
  oneBronzeMedal: function (label) {
    return getBronzeMedal(label, 1)
  },
  tenBronzeMedal: function (label) {
    return getBronzeMedal(label, 10)
  },
  goldMedal: function (label) {
    return getGoldMedal(label, 100)
  },
  getCheckinMedal: function (position) {
    let numberOfCheckin = Markers.find({checkin: Meteor.userId()}).count()
    if(numberOfCheckin >= 5 && numberOfCheckin < 20 && position === 0) return activityBadge.checkin.goldUrl
    else if(numberOfCheckin >= 20 && numberOfCheckin < 50 && position === 1) return activityBadge.checkin.goldUrl
    else if(numberOfCheckin >= 50 && position === 2) return activityBadge.checkin.goldUrl
    else return activityBadge.checkin.blankUrl
  },
  getNewLocationMedal: function (position) {
    let numberOfNewLocation = Markers.find({'creator.user': Meteor.userId()}).count()
    if(numberOfNewLocation >= 5 && numberOfNewLocation < 20 && position === 0) return activityBadge.newLocation.goldUrl
    else if(numberOfNewLocation >= 20 && numberOfNewLocation < 50 && position === 1) return activityBadge.newLocation.goldUrl
    else if(numberOfNewLocation >= 50 && position === 2) return activityBadge.newLocation.goldUrl
    else return activityBadge.newLocation.blankUrl
  },
  getSosMedal: function (position) {
    let numberOfSos = Posts.find({'info.postOwner':Meteor.userId(), catagory:'sos'})
    if(numberOfSos >= 5 && numberOfSos < 20 && position === 0) return activityBadge.sos.goldUrl
    else if(numberOfSos >= 20 && numberOfSos < 50 && position === 1) return activityBadge.sos.goldUrl
    else if(numberOfSos >= 50 && position === 2) return activityBadge.sos.goldUrl
    else return activityBadge.sos.blankUrl
  },
  isOwnProfile: function () {
    return Router.current().params.id === Meteor.userId()
  }

})
Template.aboutMe.events({
  'click .my-btn-edit' : function (e) {Session.set('aboutMeContainer','editProfile')},
  'mouseenter .badge-img': function (e) {

  },
  'click .link-seeall-follower': function (e) {
    $('.ui.modal.follower')
      .modal('show')
  },

  'click .link-seeall-following': function (e) {
    $('.ui.modal.following')
      .modal('show')
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
    var isVet = $('[name=vet]:checked'),
        vetObj = {};
    if(isVet.length > 0){
        var vetId = $('[name=vet-id]').val(),
            vetName = $('[name=vet-name]').val(),
            vetLastName = $('[name=vet-lastname]').val();
        vetObj = {
          vetId,
          vetName,
          vetLastName,
          isVet: true,
          verified: false
        }
    }
    else vetObj = {isVet : false, verified: false}

    var username = $('[name=username]').val(),
        birthday = $('[name=birthday]').val(),
        topics = $('[name=topics]:checked').map(function () {return this.value}).get(),
        newData = {
          username : username,
          birthday : birthday,
          topics : topics,
          vetObj
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


function getMedal(label, numberOfFollowing) {
  let followingIds = Meteor.users.findOne({_id:Router.current().params.id}).profile.following,
      followingSet = followingIds.map(fid => {
        let user = Meteor.users.findOne({_id:fid.followingId})
        if(user) return user
      }),
      calObj = {'สุนัข': 0, 'แมว': 0, 'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ': 0, 'นก': 0, 'สัตว์เลื้อยคลาน': 0, 'pocket pet': 0}
  if(followingSet.length > 0){
    followingSet.map( f => {
      let interesting = f.profile.topics
      if(_.contains(interesting, label)) calObj[label] += 1
    })
  }

  let transferLabel = {
    'สุนัข': 'dog', 'แมว': 'cat', 'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ': 'fish', 'นก': 'bird', 'สัตว์เลื้อยคลาน': 'turtle', 'pocket pet': 'pocket'
  }
  let newLabel = transferLabel[label]

  return {calObj,newLabel}
}

function getBronzeMedal(label, numberOfFollowing) {
  let res = getMedal(label,numberOfFollowing),
      calObj = res.calObj,
      newLabel = res.newLabel

  if(calObj[label] >= numberOfFollowing) return petImgs[newLabel].bronzeUrl
  else return petImgs[newLabel].blankUrl
}

function getGoldMedal(label, numberOfFollowing) {
  let res = getMedal(label,numberOfFollowing),
      calObj = res.calObj,
      newLabel = res.newLabel

  if(calObj[label] === numberOfFollowing) return petImgs[newLabel].goldUrl
  else return petImgs[newLabel].blankUrl
}
