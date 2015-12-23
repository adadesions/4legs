//variable scope
var locationObj = {}


//createLocation
Template.createLocation.onCreated(function () {
  Session.set('stepsContainer', 'createStep1')
})

Template.createLocation.helpers({
  stepsContainer: function () { return Session.get('stepsContainer') }
})

Template.createLocation.events({
  // 'click #next': function () {
  //   console.log("1111");
  // }
})
//Step1
Template.createStep1.helpers({
  animalType: function () {
    var data = Topices.findOne()
    return data.animalType
  }
})
Template.createStep1.events({
  'click #next': function (e) {
    var locationName = $('[name=pet-shop]').val(),
        lat = $('[name=lat-location]').val(),
        lng = $('[name=lng-location]').val(),
        businessTypes = $('[name=business-type]:checked').map(function () {
          return this.value
        }).get(),
        animalTypes = $('[name=animal-type]:checked').map(function () {
          return this.value
        }).get()

    locationObj = {
      locationName: locationName,
      lat: lat,
      lng: lng,
      businessTypes: businessTypes,
      animalTypes: animalTypes
    }
    console.log("Step 1")
    console.log(locationObj);
    Session.set('stepsContainer', 'createStep2')
  }
})
