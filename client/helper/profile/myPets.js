Session.setDefault('myPetsContainer', 'showMyPets')

//myPets
Template.myPets.helpers({
  myPetsContainer : function () {
    if(Session.equals('myPetsContainer', 'addNewPet')){
      let id = $('[name=profile-id]:hidden').val()
      if(Meteor.userId() === id) return Session.get('myPetsContainer')
      else Session.set('myPetsContainer', 'showMyPets')
    }
    return Session.get('myPetsContainer')
  }
})
//End myPets

//showMyPets
Template.showMyPets.helpers({
  allMyPets : function (myId) {
    return Pets.find({petOwner:myId})
  },
  isNoPets : function (myId) {
    return Pets.find({petOwner:myId}).count() === 0 ? true : false
  },
  localCheckAuthority : function () {
    let id = $('[name=profile-id]:hidden').val()
    return Meteor.userId() === id ? true : false
  }
})

Template.showMyPets.events({
  'click .my-add-btn' : function (e) {
    Session.set('myPetsContainer','addNewPet')
  },
  'click .my-btn-delete' : function (e) {
    var id = $('[name=id]:hidden').val()
    Meteor.call('deletePet',id, function (err) {
      if(err) toastr.error("Sorry, we can't delete your lovely pet")
      else{
        toastr.success("We've deleted your pet from list")
      }
    })
  }
})
//End showMyPets

//addnewPet
Template.addNewPet.rendered=function() {
    $('[name=petBirthday]').datepicker()
}
Template.addNewPet.helpers({
  topics : function () {
    var data = Topices.findOne()
    return data.animalType
  }
})
Template.addNewPet.events({
  'click .my-btn-done' : function (e) {
    var petName = $('[name=petName]').val(),
        petType = $('[name=petType]:checked').val(),
        petSpecies = $('[name=petSpecies]').val(),
        petGender = $('[name=petGender]:checked').val(),
        petBirthday = $('[name=petBirthday]').val(),
        petDetails = $('[name=petDetails]').val(),
        newPet = {
          petOwner : Meteor.userId(),
          petName : petName,
          type : petType,
          species : petSpecies,
          gender: petGender,
          birthday : petBirthday,
          detail : petDetails,
          img_id : ""
        }
    Meteor.call('insertNewPet', newPet, function (err) {
      if(err) toastr.error("Add new pet error... please try again.")
      else{
        toastr.success("Your pet is with us, it's so cute")
        Session.set('myPetsContainer','showMyPets')
      }
    })
  }
})
//End addNewPet
