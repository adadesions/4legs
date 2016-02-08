Template.addFollow.helpers({
  followList: function () {
    let followingList = Meteor.user().profile.following
    followingList = followingList.map( data => data.followingId)
    followingList.push(Meteor.userId())

    let query = ''
    if(Session.get('followSearch') !== ''){
      let key = Session.get('followSearch')
      userList = Meteor.users.find().fetch()
      query = userList.map( u => {
        if(u.username.indexOf(key) > -1) return u
      })
      console.log('A : '+ query);
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

Template.addFollow.onRendered(function () {
  Session.set('followSearch', '')
  $('img.avatar').css({
    'width': '6em',
    'height': '6em'
  })
})

Template.addFollow.events({
  'keyup #follow-search': function (e) {
      let word = $('#follow-search').val()
      Session.set('followSearch', word)
  }
})
