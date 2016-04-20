Session.set('zoom',10)
let markers = {},
    rawDistance = []

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
  //SEO
  Meta.setTitle("Location")

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
        map.instance.setZoom(Session.get('zoom'))
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
    google.maps.event.addListener(map.instance, 'dragend', function (e) {
      let lat = map.instance.getCenter().lat(),
          lng = map.instance.getCenter().lng(),
          newPosition = new google.maps.LatLng(lat,lng)
      Session.set('centerLat',lat)
      Session.set('centerLng',lng)
    })
    google.maps.event.addListener(map.instance, 'zoom_changed', function (e) {
      Session.set('zoom', map.instance.getZoom())
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
        let aPlace = Markers.findOne({_id:document._id})
        let imgStatus = ((aPlace) => {
          if(aPlace.promoting) return '/images/object/5-location/promoting.png'
          else{
            let avaliableList = Session.get('avaliableList')
            let inList = avaliableList.map( x => x._id === aPlace._id)
            return _.contains(inList, true) ? '/images/object/5-location/open-marker.png' : '/images/object/5-location/close2.png'
          }
        })(aPlace)

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
              //Error status disable
              console.log(status);
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
        markers[oldDocument._id].setMap(null)
        google.maps.event.clearInstanceListeners(markers[oldDocument._id])
        delete markers[oldDocument._id]
      }
    })//END OBSERVE
    //Distance Services
    let origin = new google.maps.LatLng(latLng.lat, latLng.lng),
        destination = Markers.find({promoting: false, dateSet: {$ne:[]}},{sort: {locationName: 1}}).fetch(),
        service = new google.maps.DistanceMatrixService,
        matrixDestination = []
    const howFarIsit = (service, origin, matrixDestination) => {
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [matrixDestination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
        }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          // alert('Error was: ' + status);
        }
        else {
          rawDistance.push(response.rows[0].elements[0].distance.value);
          Session.set('rawDistance', rawDistance);
        }
      })
    }
    if(destination.length >= rawDistance.length) {
      rawDistance = [];
    }
    _.map(destination, d => {
      let md = new google.maps.LatLng(d.lat,d.lng)
      howFarIsit(service, origin, md)
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
  locationContainer: function () { return Session.get('locationContainer') }
})

Template.location.events({
  'click .add-location': function () {
    Session.set('locationContainer', 'createLocation')
  },
  'click #sidebar-add-location':function () {
    $('.ui.sidebar')
    .sidebar({
      dimPage: false,
      closable: false
    })
    .sidebar('show')
  },
  'click #sidebar-location-list':function () {
    $('.ui.sidebar')
    .sidebar({
      dimPage: true,
      closable: true
    })
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
  let dayCheck = Markers.findOne({_id:id}).dateSet[0].days
  return _.contains(dayCheck, day) ? 'checked' : ''
})


Template.editAnnouncementPromotion.helpers({
  selectedLocationId: function () { return Session.get('selectedLocationId')},
  findLocation: function (id) {
    return Markers.findOne({_id:id})
  },
})

Template.editLocation.helpers({
  selectedLocationId: function () { return Session.get('selectedLocationId')},
  findLocation: function (id) {
    return Markers.findOne({_id:id})
  },
  getOpenTime: function (date) {
    return date[0].open
  },
  getCloseTime: function (date) {
    return date[0].close
  }
})

Template.editLocation.events({
  'click #back': function (e) {
    Session.set('locationContainer', 'locationSelected')
  },
  'click #next': function (e) {
    let openTime = $('[name=open-time]').val(),
        closeTime = $('[name=close-time]').val(),
        address = $('[name=address]').val(),
        tel = $('[name=tel]').val(),
        email = $('[name=email]').val(),
        facebook = $('[name=facebook]').val(),
        line = $('[name=line]').val(),
        instagram = $('[name=instagram]').val(),
        detail = $('[name=detail]').val(),
        markerId = Session.get('selectedLocationId'),
        days = $('[name=days-week]:checked').map(function () { return this.value }).get(),
        newMarker = {
          openTime,
          closeTime,
          address,
          tel,
          email,
          facebook,
          line,
          instagram,
          detail,
          days
        }
    Meteor.call('editLocationFromOwner',markerId,newMarker, function (err) {
      if(err) toastr.error("Can't update this location...")
      else{
        toastr.success("Updated location detail")
        Session.set('locationContainer', 'locationSelected')
      }
    })
  },
  'change [name=upload]': function (e) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          Meteor.call('updateLocationPhoto', Session.get('selectedLocationId'), fileObj._id)
          toastr.success('Upload succeeded!')
        }
      })
      var img = document.createElement("img"),
          preview = $('.preview-location-photo')

      img.file = $('[name=upload]')[0].files[0]
      img.onload = function () {
               if(this.width > this.height) {
                 img.classList.add('preview-photo-gtwidth-location')
                 $('.upload-group-profile').css({"margin-top":"0"})
               }
               else{
                 img.classList.add('preview-photo-gtheight-location')
                 $('.upload-group-profile').css({"margin-top":"4em"})
               }
           };
      img.classList.add('preview-img')
      img.classList.add('preview-for-profile')

      if(preview.length){
          preview.empty()
          preview.append(img)
      }
      else
        preview.append(img)
      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    })
  }
})



//locationList
Template.locationList.onRendered(function () {
  Session.set('locationSearch', '')
  let today = new Date(),
      mapDay = ['อา','จ','อ','พ','พฤ','ศ','ส'],
      day = mapDay[today.getDay()]
  let allMarkers = Markers.find({promoting: false, dateSet: {$ne:[]}},{sort: {locationName: 1}})
  let avaliableList = allMarkers.map(x => {
    let theDay = x.dateSet.map(y => {
      return _.contains(y.days,day) ? y : ''
    })

    const timeDecision = (time) => {
      if(time){
        if(time.includes('AM')){
          time = Number(time.replace('AM','').replace(':','.'))
        }
        else if(time.includes('PM')){
          time = Number(time.replace('PM','').replace(':','.'))+12
        }
        return time
      }
    }
    const isOpen24 = (open,close) => {
      return open == close
    }

    if(isOpen24(theDay[0].open,theDay[0].close)) return x
    else{
      let open = timeDecision(theDay[0].open),
          close = timeDecision(theDay[0].close),
          cTime = timeDecision(moment().format("h:mm A"))
      if(cTime > open && cTime < close) return x
    }
  })
  avaliableList = _.compact(avaliableList)
  Session.set('avaliableList', avaliableList)
})
Template.locationList.helpers({
  allLocation: function () {
    let onlyOpen = Session.get('nowOpen'),
        allMarkers = Markers.find({promoting: false, dateSet: {$ne:[]}},{sort: {locationName: 1}}),
        distanceList = _.compact(Session.get('rawDistance'))

    allMarkers = _.map(allMarkers, (m,index) => {
      m.distanceValue = distanceList[index]
      return m
    })
    //allMarkers were sorted by distanceValue
    allMarkers = _.sortBy(allMarkers, 'distanceValue')

    if(onlyOpen){
      return Session.get('avaliableList')
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
          if(aqu.indexOf(keyWord) > -1) keyWord = 'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ'
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
    let aPlace = Markers.findOne({_id:locationId})
    if(aPlace.promoting) return '/images/object/5-location/promoting.png'
    else{
      let avaliableList = Session.get('avaliableList')
      let inList = avaliableList.map( x => x._id === aPlace._id)
      return _.contains(inList, true) ? '/images/object/5-location/open.png' : '/images/object/5-location/close2.png'
    }
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
    let id = $(e.target).attr('id')
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
  },
  numberOfCheckin: function () {
    let markerId = Session.get('selectedLocationId')
    let numberOfCheckin = Markers.findOne({_id: markerId}).checkin
    return numberOfCheckin ? numberOfCheckin.length : 0
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
  },
  'click #delete-location': function (e) {
    let markerId = Session.get('selectedLocationId'),
        location = Markers.findOne({_id:markerId}),
        msg = `กดลบเพื่อยืนยันคำสั่ง`
        confirm = new Confirmation({
        message: msg,
        title: "Delete this place?",
        cancelText: "ยกเลิก",
        okText: "ลบ",
        success: false
      }, function (ok) {
          if(ok) {
            Markers.remove({_id: markerId}, function (err) {
              if(err) toastr.error('ไม่สามารถลบสถานที่นี้ได้ในตอนนี้')
              else toastr.success('ได้ทำการลบสถานที่นี้เรียบร้อยแล้ว')
            })
            Session.set('locationContainer', 'locationList')
          }
      })
  },
  'click #verifyOwnerButton': function () {
    Session.set('locationContainer', 'verifyOwner')
  },
  'click #locationEdit': function () {
    Session.set('locationContainer', 'editLocation')
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
    if(announcement && promotion) {
        Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
          announcement,
          promotion
        }
      })
    }
    else if(announcement){
      Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
          announcement
        }
      })
    }
    else if (promotion) {
      Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
          promotion
        }
      })
    }
    Session.set('locationContainer', 'locationSelected')
  },
  'click #back': function (e) {
    Session.set('locationContainer', 'locationSelected')
  },
  'change [name=announcement-upload]' : function (e, template) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
              announcementImg: fileObj._id,
            }
          })
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.announcement-upload-preview')
      var img = document.createElement("img")
      img.file = $('[name=announcement-upload]')[0].files[0]
      img.classList.add('ui','centered','medium','image')

      if(uploadPicture.children().length == 0)
       uploadPicture.append(img)
      else
       uploadPicture.children().replaceWith(img)

      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    })
  },

  'change [name=promotion-upload]' : function (e, template) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          Markers.update({_id: Session.get('selectedLocationId')}, {$set: {
              promotionImg: fileObj._id,
            }
          })
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.promotion-upload-preview')
      var img = document.createElement("img")
      img.file = $('[name=promotion-upload]')[0].files[0]
      img.classList.add('ui','centered','medium','image')

      if(uploadPicture.children().length == 0)
       uploadPicture.append(img)
      else
       uploadPicture.children().replaceWith(img)

      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    })
  },

  'click #announcement-photo-upload': function (e) {
    $('[name=announcement-upload]').trigger('click')
  },
  'click #promotion-photo-upload': function (e) {
    $('[name=promotion-upload]').trigger('click')
  },
})
