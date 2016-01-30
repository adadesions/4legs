let markers = {}

Template.favoritePlace.onRendered(function () {
  GoogleMaps.load()
  $('.ui.rating').rating({
    initialRating: 2,
    maxRating: 4
  })
})

Template.favoritePlace.onCreated(function() {
  let self = this
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('favoritePlace', function(map) {
    // Add a marker to the map once it's ready
    self.autorun(function () {
      if(Session.get('centerLat')){
        let centerLat = Session.get('centerLat'),
            centerLng = Session.get('centerLng'),
            newPosition = new google.maps.LatLng(centerLat,centerLng)
        map.instance.setCenter(newPosition)
        map.instance.setZoom(15)
      }
      else{
        map.instance.setCenter(new google.maps.LatLng(13.756331, 100.501765))
        map.instance.setZoom(6)
      }
    })

    Markers.find({asFavorite: Meteor.userId()}).observe({
      //ADDED MARKER
      added: function (document) {
        let openImg = {
          url: '/images/object/5-location/open-marker.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0)
        }
        let marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat,document.lng),
          map: map.instance,
          id: document._id,
          icon: openImg
        })
        google.maps.event.addListener(marker,'click',function (e) {
          let info = Markers.findOne({_id:marker.id}),
              contentForInfo = '<div class="ui card"><div class="image"><img src="'+Images.findOne({_id:info.photos._id}).url()+'"></div><div class="extra ui center aligned container"><h3 class="ui header">'+info.locationName+'</h3></div>',
              eLatLng = new google.maps.LatLng(document.lat,document.lng),
              infoWindow = new google.maps.InfoWindow({
                map: map.instance,
                content: contentForInfo
              })

          infoWindow.setPosition(eLatLng);
          Session.set('selectedLocationId',document._id)
          Session.set('locationContainer','locationSelected')
        })
        markers[document._id] = marker
      },
      //REMOVED MARKER
      removed: function (oldDocument) {
        console.log('right');
        markers[oldDocument._id].setMap(null)
        google.maps.event.clearInstanceListeners(markers[oldDocument._id])
        delete markers[oldDocument._id]
      }
    })//END OBSERVE
  });
});

Template.favoritePlace.helpers({
  favoritePlace: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(13.756331, 100.501765),
        zoom: 6
      }
    }
  },
  allMyLocation: function () {
   return Markers.find({asFavorite: Meteor.userId()})
  }
})
