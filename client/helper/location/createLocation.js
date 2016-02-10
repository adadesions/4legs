//variable scope
let locationObj = {},
    dateSet = []
var getChecked = function (name) {
  var sel = '[name='+name+']:checked'
  return $(sel).map(function () { return this.value }).get()
}
var setCheck = function (values) {
  _.each(values, function (value) {
    $('[value="'+value+'"]').prop('checked',true)
  })
}

//createLocation
Template.createLocation.onCreated(function () {
  Session.set('stepsContainer', 'createStep1')
})

Template.createLocation.helpers({
  stepsContainer: function () { return Session.get('stepsContainer') }
})

//Step1
Template.createStep1.onRendered(function () {
  $('[name=pet-shop]').val(locationObj.locationName)
  $('[name=lat-location]').val(locationObj.lat)
  $('[name=lng-location]').val(locationObj.lng)
  setCheck(locationObj.businessTypes)
  setCheck(locationObj.animalTypes)
})
Template.createStep1.helpers({
  animalType: function () {
    var data = Topices.findOne()
    return data.animalType
  },
})
Template.createStep1.events({
  'click #next': function (e) {
    e.preventDefault()
    var locationName = $('[name=pet-shop]').val(),
        lat = $('[name=lat-location]').val(),
        lng = $('[name=lng-location]').val(),
        businessTypes = getChecked('business-type'),
        animalTypes = getChecked('animal-type')

    locationObj.locationName = locationName
    locationObj.lat = lat,
    locationObj.lng = lng
    locationObj.businessTypes = businessTypes
    locationObj.animalTypes = animalTypes
    Session.set('stepsContainer', 'createStep2')
  },
  'click #cancel': function () {
    Session.set('locationContainer', 'location')
  }
})

//Step2
Template.createStep2.onCreated(function () {
  $('.timepicker').val("")
})
Template.createStep2.onRendered(function () {
  setCheck(locationObj.daysWeek)
  $('[name=open-time]').val(locationObj.openTime)
  $('[name=close-time]').val(locationObj.closeTime)
  $('[name=address]').val(locationObj.address)
  $('[name=detail]').val(locationObj.detail)
  $('.add-time .custom.button')
  .popup({
    popup : $('.custom.popup'),
    on    : 'click',
    position : 'bottom left'
  })
  $('.ui.popup').css('z-index','3')
})
Template.createStep2.events({
  'click #submit-time': function (e) {
    e.preventDefault()
    let open = $('[name=open-time]').val(),
        close = $('[name=close-time]').val(),
        days = getChecked('days'),
        logical = (open !== '' && close !== '' && days.length > 0)
    if(logical)
    dateSet.push({
      open,
      close,
      days
    })
    var clearCheck = function (values) {
      _.each(values, function (value) {
        $('[value="'+value+'"]').prop('checked',false)
      })
    }
    $('[name=open-time]').val('')
    $('[name=close-time]').val('')
    $('[name=every-days]').prop('checked',false)
    clearCheck(['อา','จ','อ','พ','พฤ','ศ','ส'])

    //Show Time
    let html = dateSet.map(d => {
      let dayStr = d.days.map(s => s)
      return `<span>${dayStr}</span> ${d.open} - ${d.close}<br>`
    })
    $('.show-time').empty().append(html)
  },
  'click [name=every-days]': function (e) {
    setCheck(['อา','จ','อ','พ','พฤ','ศ','ส'])
  },
  'click #next': function (e) {
    e.preventDefault()
    locationObj.dateSet = dateSet
    locationObj.address = $('[name=address]').val()
    locationObj.detail = $('[name=detail]').val()
    Session.set('stepsContainer', 'createStep3')
  },
  'click #back': function (e) {
    Session.set('stepsContainer', 'createStep1')
  },
  'blur .bootstrap-timepicker-widget': function (e) {
    $('.bootstrap-timepicker-widget').hide()
  },
  'change [name=upload]': function (e) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          locationObj.photos = {'_id': fileObj._id}
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
  },
})


//Step3
Template.createStep3.onRendered(function () {
  $('[name=tel]').val(locationObj.tel)
  $('[name=email]').val(locationObj.email)
  $('[name=website]').val(locationObj.website)
  $('[name=facebook]').val(locationObj.facebook)
  $('[name=line]').val(locationObj.line)
  $('[name=instagram]').val(locationObj.instagram)
})

Template.createStep3.events({
  'click #save': function (e) {
    locationObj.tel = $('[name=tel]').val()
    locationObj.email = $('[name=email]').val()
    locationObj.website = $('[name=website]').val()
    locationObj.facebook = $('[name=facebook]').val()
    locationObj.line = $('[name=line]').val()
    locationObj.instagram = $('[name=instagram]').val()
    locationObj.creator = {
      user: Meteor.userId(),
      app: navigator.appName,
      appCode: navigator.appCodeName,
      platform: navigator.platform,
      createdAt: new Date()
    }
    //save to marker
    if(locationObj.locationName) Markers.insert(locationObj)
    Session.set('stepsContainer', 'createStep4')
  },
  'click #back': function (e) {
    e.preventDefault()
    Session.set('stepsContainer', 'createStep2')
  }
})

//Step 4
Template.createStep4.onRendered(function () {
  Session.set('showOwnerDialog', false)
})
Template.createStep4.events({
  'click [type=radio]': function (e) {
    var $val = $(e.target).val()
    $('#done').prop('disabled','')
    $val === 'yes' ? Session.set('showOwnerDialog', true) : Session.set('showOwnerDialog', false)
  },
  'click #done': function (e) {
    let $val = $('[type=radio]:checked').val()
    if($val === 'yes'){
      let ownerName = $('[name=ownerName]').val(),
          ownerTel = $('[name=ownerTel]').val(),
          ownerEmail = $('[name=ownerEmail]').val(),
          ownerId = Meteor.userId()
      locationObj.owner = {
        ownerId,
        ownerName,
        ownerTel,
        ownerEmail,
        verified: false
      }
    }
    Meteor.call('markersUpdateByLocation',locationObj.lat, locationObj.lng, locationObj.owner)
    Session.set('locationContainer', 'location')
  }
})
Template.createStep4.helpers({
  showOwnerDialog: function () { return Session.get('showOwnerDialog') }
})
