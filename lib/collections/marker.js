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
  },
  'editLocationFromOwner': function (markerId, newMarker) {
      let oldMarker = Markers.findOne({_id: markerId})
      Markers.update({
         _id: markerId,
        'dateSet.open': oldMarker.dateSet[0].open,
        'dateSet.close': oldMarker.dateSet[0].close,
      },
      {
        $set: {
          "dateSet.$.open": newMarker.openTime,
          "dateSet.$.close": newMarker.closeTime,
          "dateSet.$.days": newMarker.days,
          address: newMarker.address,
          tel: newMarker.tel,
          email: newMarker.email,
          facebook: newMarker.facebook,
          line: newMarker.line,
          instagram: newMarker.instagram,
          detail: newMarker.detail
        }
      })
  },
  'updateLocationPhoto': function (markerId, photoId) {
    Markers.update({_id: markerId}, {
      $set: {
        'photos._id': photoId
      }
    })
  }
})
