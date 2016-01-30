const MAP_ZOOM = 10
let markers = {},
    availableList = []

function getIcon(value) {
  let imgUrl = {
    'สถานพยาบาล': '/images/object/2-signup/clinic.png',
    'บริการสัตว์เลี้ยง': '/images/object/2-signup/grooming.png',
    'ร้านค้า': '/images/object/2-signup/shop-03.png',
    'สุนัข': '/images/object/2-signup/dog.png',
    'แมว': '/images/object/2-signup/cat.png',
    'pocket pet': '/images/object/2-signup/petpocket.png',
    'นก': '/images/object/2-signup/bird.png',
    'สัตว์เลื้อยคลาย': '/images/object/2-signup/turtle.png',
    'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ': '/images/object/2-signup/fish.png',
  }
  return imgUrl[value]
}

Template.location.onRendered(function () {
  GoogleMaps.load()
  Session.set('nowOpen', false)
})

Template.location.onCreated(function() {
  Session.set('locationContainer', 'locationList')
  //START GOOGLE MAPS SECION
  var self = this,
      latLng= {}
  GoogleMaps.ready('4legsMap', function(map) {
    var marker,
        directionsDisplay = new google.maps.DirectionsRenderer,
        directionsService = new google.maps.DirectionsService

    directionsDisplay.setMap(map.instance)

    self.autorun(function () {
      latLng = Geolocation.latLng()
      if (!latLng)
        return

      if(!marker){
          let currentImg = {
            url: '/images/object/5-location/human-marker.png',
            size: new google.maps.Size(36, 65),
            origin: new google.maps.Point(0, 0)
          }

          marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance,
          icon: currentImg
        })
      }
      else marker.setPosition(latLng)

      if(Session.get('centerLat')){
        let centerLat = Session.get('centerLat'),
            centerLng = Session.get('centerLng'),
            newPosition = new google.maps.LatLng(centerLat,centerLng)
        map.instance.setCenter(newPosition)
        map.instance.setZoom(15)
      }
      else{
        map.instance.setCenter(marker.position)
        map.instance.setZoom(10)
      }
    })

    google.maps.event.addListener(map.instance, 'click', function (e) {
      $('#lat').val(e.latLng.lat())
      $('#lng').val(e.latLng.lng())
    })
    google.maps.event.addListener(marker,'click',function (e) {
      let latLng = e.latLng,
          infoWindow = new google.maps.InfoWindow({map: map.instance})
      infoWindow.setPosition(latLng);
      infoWindow.setContent('You are here');
    })
    //code here
    Markers.find().observe({
      //ADDED MARKER
      added: function (document) {
        let inList = availableList.map( x => x._id === document._id)
        let imgStatus =  _.contains(inList, true) ? '/images/object/5-location/open-marker.png' : '/images/object/5-location/close-marker.png'
        let openImg = {
          url: imgStatus,
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
              contentForInfo = '<br><div class="ui card"><div class="image"><img src="'+Images.findOne({_id:info.photos._id}).url()+'"></div><div class="extra ui center aligned container"><h3 class="ui header">'+info.locationName+'</h3></div>',
              eLatLng = new google.maps.LatLng(document.lat,document.lng),
              infoWindow = new google.maps.InfoWindow({
                map: map.instance,
                content: contentForInfo
              })

          infoWindow.setPosition(eLatLng);
          Session.set('selectedLocationId',document._id)
          Session.set('locationContainer','locationSelected')

          //Distance Services
          let origin = new google.maps.LatLng(latLng.lat, latLng.lng),
              destination = eLatLng,
              service = new google.maps.DistanceMatrixService

          service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
            }, function(response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
              alert('Error was: ' + status);
            }
            else {
              let originList = response.originAddresses,
                  destinationList = response.destinationAddresses,
                  distance = response.rows[0].elements[0].distance.text
              Session.set('distance', distance)
            }
          })

          directionsDisplay.setMap(null)
          directionsDisplay.setMap(map.instance)

          directionsService.route({
            origin: origin,
            destination: eLatLng,
            travelMode: google.maps.TravelMode.DRIVING
          }, function (res, status) {
            if(status === google.maps.DirectionsStatus.OK){
              directionsDisplay.setDirections(res)
            }
            else{
              console.log('fail!');
            }
          })
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
  })//END GOOGLE MAPS READY
})

Template.location.helpers({
  MapOptions: function() {
    if (GoogleMaps.loaded()) {
    var latLng = Geolocation.latLng()
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded() && latLng) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(latLng.lat,latLng.lng),
        options: {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        zoom: 10
      }
    }
    }
  },
  geolocationError: function () {
    var error = Geolocation.error();
    return error && error.message;
  },
  locationContainer: function () { return Session.get('locationContainer')}
})

Template.location.events({
  'click .add-location': function () {
    Session.set('locationContainer', 'createLocation')
  }
})

//locationList
Template.locationList.helpers({
  allLocation: function () {
    let onlyOpen = Session.get('nowOpen')
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
    availableList = _.reject(placeList, x => x === undefined)

    if(onlyOpen){
      return availableList
    }
    else
      return Markers.find({},{sort: {locationName: 1}})
  }
})
Template.locationList.events({
  'click [name=now-open]': function (e) {
    let state = $('[name=now-open]:checked').length > 0 ? true : false
    Session.set('nowOpen', state)
  }
})


//theList
Template.theList.helpers({
  locationServices: function (value) {
    return getIcon(value)
  },
  isOpen: function (locationId) {
    let aPlace = Markers.findOne({_id:locationId})
    let inList = availableList.map( x => x._id === aPlace._id)
    return _.contains(inList, true) ? '/images/object/5-location/open.png' : '/images/object/5-location/close.png'
  }
})
Template.theList.events({
  'click .the-list-block': function (e) {
    let $ele = $(e.target),
        id = $ele.attr('id'),
        lat = $ele.data('lat'),
        lng = $ele.data('lng')
    // console.log('lat: '+lat+' lng: '+lng);
    if(!id){
      id = $ele.closest('.the-list-block').attr('id'),
      lat = $ele.closest('.the-list-block').data('lat'),
      lng = $ele.closest('.the-list-block').data('lng')
    }
    Session.set('selectedLocationId',id)
    Session.set('locationContainer','locationSelected')
    Session.set('centerLat', lat)
    Session.set('centerLng', lng)
    google.maps.event.trigger(markers[id], 'click')
  }
})

//LocationSelected
Template.locationSelected.onRendered(function () {
  Session.set('subSelectedLocationContainer', 'locationDetail')
})
Template.locationSelected.helpers({
  selectedLocationId: function () { return Session.get('selectedLocationId')},
  subSelectedLocationContainer: function () { return Session.get('subSelectedLocationContainer')},
  findLocation: function (id) {
    return Markers.findOne({_id:id})
  },
  locationServices: function (value) {
    return getIcon(value)
  },
  getDistance: function () {
    return Session.get('distance')
  }
})
Template.locationSelected.events({
  'click #back': function (e) {
    Session.set('locationContainer', 'location')
  },
  'click #locationDetail': function (e) { Session.set('subSelectedLocationContainer','locationDetail')},
  'click #locationAnnouncement': function (e) { Session.set('subSelectedLocationContainer','locationAnnouncement')},
  'click #locationComment': function (e) { Session.set('subSelectedLocationContainer','locationComment')}
})

//locationDetail
Template.locationDetail.helpers({
  getImageUrl: function (imgId) {
    let img = Images.findOne({_id:imgId})
    return img ? img.url() : '/images/object/7-profile/badge-top2-04.png'
  },
  isOpen: function (obj) {
    return _.contains(obj.hash.data, obj.hash.day) ? 'is-open' : ''
  }
})

//locationComment
Template.locationComment.helpers({
  feedComment: function (locationId) {
    return Markers.findOne({_id:locationId}).comments || ""
  }
})
