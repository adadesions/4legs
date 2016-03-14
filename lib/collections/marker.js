Markers = new Mongo.Collection('markers')

Meteor.methods({
  'markersUpdateByLocation': function (lat, lng, owner) {
    Markers.upsert({lat:lat,lng:lng}, {
      $set: {
        owner: owner
      }
    })
  },
  'updateLocationVerify': function (markerId, isVerify) {
    Markers.update({_id: markerId}, {$set: {
        'owner.verified': isVerify
      }
    })
  },
  'promoteLocation': function (markerId, isPromote) {
      Markers.update({_id: markerId}, {$set: {
        'promoting': isPromote
        }
    })
  }
})
