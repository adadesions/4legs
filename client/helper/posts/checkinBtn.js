Template.checkinBtn.events({
  'click .icon-checkin': function (e) {
    let markerId = Session.get('selectedLocationId'),
        thisLocation = Markers.findOne({_id: markerId}),
        postObj = {
          comments: [],
          likes: [],
          shares: [],
          favorites: [],
          catagory: ['newsfeed','checkin'],
          img: {_id: thisLocation.photos._id},
          info: {
            postOwner: Meteor.userId(),
            postBody: `<strong>${Meteor.user().username}</strong> has <ins>checked in</ins> at <strong>${thisLocation.locationName}</strong>`,
            createdAt: new Date()
          }
        }
    Posts.insert(postObj, function (err) {
      if(err){
        toastr.error('Sorry, you can not checkin this place right now.')
        throw error
      }
      else{
        Markers.upsert({_id: markerId}, {$addToSet: {checkin: Meteor.userId()}})
        toastr.success(`You've checked in this place alreay and we have posted yours checkin post`)
      }
    })
  }
})

Template.checkinBtn.helpers({
  isCheckin: function(markerId){
      return Markers.find({_id:markerId, checkin:Meteor.userId()}).count() > 0 ? '/images/object/5-location/checkin.png' : '/images/object/5-location/checkin-gray.png'
  }
})
