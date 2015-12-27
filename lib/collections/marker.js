Markers = new Mongo.Collection('markers')

Meteor.methods({
  'markersUpdateByLocation': function (lat, lng, owner) {
    Markers.upsert({lat:lat,lng:lng}, {
      $set: {
        owner: owner
      }
    })
  }
})
