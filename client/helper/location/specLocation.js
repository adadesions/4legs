Template.specLocation.helpers({
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
  },
  locationServices: function (value) {
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
    return getIcon(value)
  }
})

Template.specLocation.onRendered(function () {
  $('.ui.rating')
  .rating({
    maxRating: 5
  })
})

Template.specLocation.events({
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
