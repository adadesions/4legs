var MAP_ZOOM = 9

Template.location.onRendered(function () {
  GoogleMaps.load()
})

Template.location.onCreated(function() {
  var self = this
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('4legsMap', function(map) {
    var marker
    self.autorun(function () {
      var latLng = Geolocation.latLng()
      if (!latLng)
        return

      if(!marker){
          marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance
        })
      }
      else marker.setPosition(latLng)

      map.instance.setCenter(marker.getPosition());
      map.instance.setZoom(MAP_ZOOM);
    })

    google.maps.event.addListener(map.instance, 'click', function (e) {
      $('#lat').val(e.latLng.lat())
      $('#lng').val(e.latLng.lng())
    })    
    //code here
    var markers = {}
    Markers.find().observe({
      //ADDED MARKER
      added: function (document) {
        let marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat,document.lng),
          map: map.instance,
          id: document._id
        })
        google.maps.event.addListener(marker, 'dragend', function (e) {
          Markers.update({_id:marker.id}, {
            $set : {
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            }
          })
        })
        markers[document._id] = marker
      },
      //CHANGED MARKER
      changed: function (newDocument,oldDocument) {
        markers[oldDocument._id].setPosition({
          lat: newDocument.lat,
          lng: newDocument.lng
        })
      },
      //REMOVED MARKER
      removed: function (oldDocument) {
        console.log('right');
        markers[oldDocument._id].setMap(null)
        google.maps.event.clearInstanceListeners(markers[oldDocument._id])
        delete markers[oldDocument._id]
      }
    })//END OBSERVE
  })//END GOOGLE MAPS READY
})

Template.location.helpers({
  MapOptions: function() {
    var latLng = Geolocation.latLng()
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded() && latLng) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(latLng.lat,latLng.lng),
        zoom: MAP_ZOOM
      }
    }
  },
  geolocationError: function () {
    var error = Geolocation.error();
    return error && error.message;
  }
})

Template.location.events({
  'click #add-location-btn': function (e) {
    e.preventDefault()
    var lat = $('#lat').val(),
        lng = $('#lng').val()
    Markers.insert({
      lat: lat,
      lng: lng
    })
    //clear value
    $('[name=pet-shop]').val("")
    $('#lat').val("")
    $('#lng').val("")
  }
})
