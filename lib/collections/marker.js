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

availableListFn = function(){
  let placeList = Markers.find({},{sort: {locationName: 1}}).fetch()
  placeList = placeList.map(x => {
    let cTime = moment().format("h:mm A"),
        open = x.openTime,
        close = x.closeTime,
        aTime = [open,close,cTime]
    aTime = aTime.map(t => {
      if(t.indexOf('AM') > -1){
        t = t.replace(':','.')
        t = t.replace('AM','')
      }
      else if(t.indexOf('PM') > -1){
        t = t.replace(':','.')
        t = t.replace('PM','')
        t = Number(t)+12
      }
      return Number(t)
    })

    if(aTime[2]>aTime[0] && aTime[2]<aTime[1]) return x
    else if(aTime[0] == (aTime[1]-12).toFixed(2)) return x
  })
  return _.reject(placeList, x => x === undefined)
}
