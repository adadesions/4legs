Template.addFollow.helpers({
  followList: function () {
    let followingList = Meteor.user().profile.following,
        userList = Meteor.users.find().fetch()

    followingList = followingList.map( data => data.followingId)
    followingList.push(Meteor.userId())

    let query = ''
    if(Session.get('followSearch') !== ''){
      query = userList.map( u => {
        let name = u.username
        let key = Session.get('followSearch')
        if(name)
          if(name.includes(key)) return u
      })
      query = _.compact(query)
    }
    else{
      query = Meteor.users.find({
        '_id' : {
          $nin: followingList
        }
      }, {sort: {username: 1}})
    }
    return query
  }
})

Template.addFollow.onCreated(function () {
  $('img.avatar').css({
    'width': '8em',
    'height': '8em'
  })
})

Template.addFollow.onRendered(function () {
  Session.set('followSearch', '')
})

Template.addFollow.events({
  'keyup #follow-search': function (e) {
      let word = $('#follow-search').val()
      Session.set('followSearch', word)
      console.log(Session.get('followSearch'));
  },
  'click .followBtn': function (e) {
    let fid = $(e.target).attr('id'),
        username = Meteor.users.findOne({_id:fid}).username
    Meteor.call('addFollowing', fid)
    Meteor.call('addFollower', fid)
    toastr.success('You are following '+username)
  }
})
