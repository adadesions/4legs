const MAP_ZOOM = 10
let markers = {},
    rawDistance

function getIcon(value) {
  let imgUrl = {
    'สถานพยาบาล': '/images/object/2-signup/clinic.png',
    'บริการสัตว์เลี้ยง': '/images/object/2-signup/grooming.png',
    'ร้านค้า': '/images/object/2-signup/shop-03.png',
    'สุนัข': '/images/object/2-signup/dog.png',
    'แมว': '/images/object/2-signup/cat.png',
    'pocket pet': '/images/object/2-signup/petpocket.png',
    'นก': '/images/object/2-signup/bird.png',
    'สัตว์เลื้อยคลาน': '/images/object/2-signup/turtle.png',
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
        directionsService = new google.maps.DirectionsService,
        infoWindow = null

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
        // if(!availableList) availableList = availableListFn()
        // let inList = availableList.map( x => x._id === document._id)
        // let imgStatus =  _.contains(inList, true) ? '/images/object/5-location/open-marker.png' : '/images/object/5-location/close-marker.png'
        let imgStatus = '/images/object/5-location/open-marker.png'
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
          if(infoWindow) infoWindow.close()
          let info = Markers.findOne({_id:marker.id}),
              contentForInfo = '<h3 class="ui header">'+info.locationName+'</h3>',
              eLatLng = new google.maps.LatLng(document.lat,document.lng)
          infoWindow = new google.maps.InfoWindow({
                map: map.instance,
                content: contentForInfo
          })
          // infoWindow.close()
          infoWindow.setPosition(eLatLng);
          // infoWindow.open()
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
    //Distance Services
    let origin = new google.maps.LatLng(latLng.lat, latLng.lng),
        destination = Markers.find({promoting: false},{sort: {locationName: 1}}).fetch(),
        service = new google.maps.DistanceMatrixService
    let matrixDestination = destination.map( d => new google.maps.LatLng(d.lat,d.lng))
    service.getDistanceMatrix({
      origins: [origin],
      destinations: matrixDestination,
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
        rawDistance = response.rows.map( r => { return r.elements.map( (e,index) => {
              return e.distance.value
          })
        })
        Session.set('rawDistance', rawDistance)
      }
    })
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
  },
  'click #locationEdit': function () {
    Session.set('locationContainer', 'editLocation')
  },
  'click #verifyOwnerButton': function () {
    Session.set('locationContainer', 'verifyOwner')
  },
  'click #showMap':function () {
    $('.ui.sidebar')
    .sidebar('toggle')
  },
})

Template.verifyOwner.onRendered(function () {
  Session.set('showOwnerDialog', false)
})

Template.verifyOwner.events({
  'click [type=radio]': function (e) {
    var $val = $(e.target).val()
    $('#done').prop('disabled','')
    $val === 'yes' ? Session.set('showOwnerDialog', true) : Session.set('showOwnerDialog', false)
  },
  'click #back': function (e) {
    Session.set('locationContainer', 'locationSelected')
  },
  'click #done': function (e) {
    let ownerName = $('[name=ownerName]').val(),
        ownerTel = $('[name=ownerTel]').val(),
        ownerEmail = $('[name=ownerEmail]').val()
        ownerObj = {
          ownerId: Meteor.userId(),
          ownerName,
          ownerTel,
          ownerEmail,
          verified: false
        },
        markerId = Session.get('selectedLocationId')

    Markers.update({_id:markerId}, {
      $set:{
        owner: ownerObj
      }
    })

    toastr.success('โปรดรอการตรวจสอบความถูกต้องจากทาง Admin ซักครู่ครับ')
    Session.set('locationContainer', 'locationSelected')
  }
})

Template.verifyOwner.helpers({
  showOwnerDialog: function () { return Session.get('showOwnerDialog') }
})

Template.registerHelper('isChecked', function (day,id) {
  let dayCheck = Markers.findOne({_id:id}).daysWeek
  return _.contains(dayCheck, day) ? 'checked' : ''
})

Template.editLocation.helpers({
  selectedLocationId: function () { return Session.get('selectedLocationId')},
  findLocation: function (id) {
    return Markers.findOne({_id:id})
  }
})

Template.editAnnouncementPromotion.helpers({
  selectedLocationId: function () { return Session.get('selectedLocationId')},
  findLocation: function (id) {
    return Markers.findOne({_id:id})
  },
})

Template.editLocation.events({
  'click #back': function (e) {
    Session.set('locationContainer', 'locationSelected')
  }
})



//locationList
Template.locationList.onRendered(function () {
  Session.set('locationSearch', '')
})
Template.locationList.helpers({
  allLocation: function () {
    let onlyOpen = Session.get('nowOpen'),
        allMarkers = Markers.find({promoting: false},{sort: {locationName: 1}}),
        distanceList = _.flatten(Session.get('rawDistance')),
        today = new Date(),
        mapDay = ['จ','อ','พ','พฤ','ศ','ส','อา'],
        day = mapDay[today.getDay()-1]
    allMarkers = allMarkers.map( (m,index) => {
      m.distanceValue = distanceList[index]
      return m
    })
    //allMarkers were sorted by distanceValue
    allMarkers = _.sortBy(allMarkers, 'distanceValue')

    let availableList = allMarkers.map(x => {
      let theDay = x.dateSet.map(y => {
        return _.contains(y.days,day) ? y : ''
      })
      theDay = _.compact(theDay)
    })

    if(onlyOpen){
      return availableList
    }
    else{
      if(Session.get('locationSearch')){
        let searchList = allMarkers.map( x => {
          let keyWord = Session.get('locationSearch').toLowerCase(),
              name = x.locationName.toLowerCase(),
              animalTypes = x.animalTypes,
              bizTypes = x.businessTypes,
              otherKeys = animalTypes.concat(bizTypes)
          const dog = 'หมา กระดูก ปอม ลาบาดอ',
                pocket = 'กระต่าย กระรอก หนู',
                reptil = 'เต่า งู กิ้งก่า',
                aqu = 'ปลา กบ',
                service = 'โรงแรม hotal อาบน้ำ ตัดขน กรูมมิ่ง Grooming สระว่ายน้ำ ฝากเลี้ยง คาเฟ่ cafe โรงเรียน ฝึก สนาม playground ฟิตเนส finess เที่ยว',
                shop = 'อาหาร เพ๊ทช๊อป petshop อุปการณ์ ฟาร์ม farm'
          if(dog.indexOf(keyWord) > -1) keyWord = 'สุนัข'
          if(pocket.indexOf(keyWord) > -1) keyWord = 'pocket pet'
          if(reptil.indexOf(keyWord) > -1) keyWord = 'สัตว์เลื้อยคลาน'
          if(aqu.indexOf(keyWord) > -1) keyWord = 'สัตวน้ำ/สัตว์ครึ่งบกครึ่งน้ำ'
          if(service.indexOf(keyWord) > -1) keyWord = 'บริการสัตว์เลี้ยง'
          if(shop.indexOf(keyWord) > -1) keyWord = 'ร้านค้า'
          if(name.indexOf(keyWord) > -1 || _.indexOf(otherKeys, keyWord) > -1 ) return x
        })
        return _.reject(searchList, x => x === undefined)
      }
      else
        return allMarkers
    }
  },
  promotingLocation: function () {
    return Markers.find({promoting:true}).fetch()
  }
})

Template.locationList.events({
  'click [name=now-open]': function (e) {
    let state = $('[name=now-open]:checked').length > 0 ? true : false
    Session.set('nowOpen', state)
  },
  'keyup #location-search': function (e) {
    if(e.keyCode === 13) e.preventDefault()

    let keySearch = $('#location-search').val()
    Session.set('locationSearch', keySearch)
  }
})


//theList
Template.theList.helpers({
  locationServices: function (value) {
    return getIcon(value)
  },
  markerType: function (locationId) {
    // let aPlace = Markers.findOne({_id:locationId})
    // let inList = availableList.map( x => x._id === aPlace._id)
    // return _.contains(inList, true) ? '/images/object/5-location/open.png' : '/images/object/5-location/close.png'
    let place = Markers.findOne({_id: locationId})
    if(place.promoting) return '/images/object/5-location/promoting.png'
    else return '/images/object/5-location/open.png'
  }
})
Template.theList.events({
  'click .the-list-block': function (e) {
    let $ele = $(e.target),
        id = $ele.attr('id'),
        lat = $ele.data('lat'),
        lng = $ele.data('lng')
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
  'click #locationComment': function (e) { Session.set('subSelectedLocationContainer','locationComment')},
  'click .icon-favorite': function (e) {
    let id =$(e.target).attr('id')
    Markers.upsert({_id:id},{
      $addToSet: {
        asFavorite: Meteor.userId()
      }
    })
  }


})

//locationDetail
Template.locationDetail.helpers({
  getImageUrl: function (imgId) {
    let img = Images.findOne({_id:imgId})
    return img ? img.url() : '/images/object/7-profile/badge-top2-04.png'
  },
  isOpen: function (obj) {
    return _.contains(obj.hash.data, obj.hash.day) ? 'is-open' : ''
  },
  canEdit: function (owner) {
    if(owner)
      return (owner.ownerId === Meteor.userId()) && owner.verified ? true : false
  },
  getRating: function (markerId) {
    let rating = Markers.findOne({_id: markerId}).rating
    return Math.floor((rating.reduce( (r,x) => r+x))/(rating.length))
  }
})

Template.locationDetail.onRendered(function () {
  $('.ui.rating')
  .rating({
    maxRating: 5
  })
})

Template.locationDetail.events({
  'click .rating': function (e) {
    let rate = $('.ui.rating').rating('get rating'),
        markerId = Session.get('selectedLocationId')
    Markers.update({_id: markerId}, {$addToSet: {rating: rate}})
  }
})

//locationComment
Template.locationComment.helpers({
  feedComment: function (locationId) {
    return Markers.findOne({_id:locationId}).comments || ""
  }
})

//locationAnnouncement
Template.locationAnnouncement.events({
  'click #announcement-button-edit': function () {
    Session.set('locationContainer', 'editAnnouncementPromotion')
  },
})
Template.locationAnnouncement.helpers({
  canEdit: function (owner) {
    if(owner)
      return (owner.ownerId === Meteor.userId()) && owner.verified ? true : false
  }
})


//editAnnouncementPromotion
Template.editAnnouncementPromotion.helpers({
  myLocation: function () {
    return Markers.findOne({_id: Session.get('selectedLocationId')})
  }
})
Template.editAnnouncementPromotion.events({
  'click #submit-promotion': function (e) {
    let announcement = $('[name=announcement]').val(),
        promotion = $('[name=promotion]').val()
    Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
      announcement,
      promotion
    }
  })
    Session.set('locationContainer', 'locationSelected')
  },
  'click #back': function (e) {
    Session.set('locationContainer', 'locationSelected')
  }
})
