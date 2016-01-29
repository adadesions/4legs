Session.setDefault('myPetsContainer', 'showMyPets')
let newPet = {}
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
    return Pets.find({'info.petOwner':myId})
  },
  isNoPets : function (myId) {
    return Pets.find({'info.petOwner':myId}).count() === 0 ? true : false
  },
  localCheckAuthority : function (userId) {    
    return Meteor.userId() === userId ? true : false
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
    let petName = $('[name=petName]').val(),
        petType = $('[name=petType]:checked').val(),
        petSpecies = $('[name=petSpecies]').val(),
        petGender = $('[name=petGender]:checked').val(),
        petBirthday = $('[name=petBirthday]').val(),
        petDetails = $('[name=petDetails]').val()
        //New pet object
        newPet.info = {
          petName,
          petOwner : Meteor.userId(),
          type : petType,
          species : petSpecies,
          gender: petGender,
          birthday : petBirthday,
          detail : petDetails,
        }
    Meteor.call('insertNewPet', newPet, function (err) {
      if(err) toastr.error("Add new pet error... please try again.")
      else{
        toastr.success("Your pet is with us, it's so cute")
        Session.set('myPetsContainer','showMyPets')
      }
    })
  },
  'click .add-more-pic': function (e) {
    $('[name=upload]').click()
  },
  'change [name=upload]' : function (e, template) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          newPet.img = {'_id': fileObj._id}
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.upload-picture')
      var img = document.createElement("img")
      img.file = $('[name=upload]')[0].files[0]
      img.onload = function () {
               if(this.width > this.height) img.classList.add('preview-img-gtwidth')
               else img.classList.add('preview-img-gtheight')
           };
      img.classList.add('preview-img')
      var preview = $('.preview-img')

      if(preview.length)
       preview.replaceWith(img)
      else
       uploadPicture.append(img)


      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)

      $('.upload-group, .add-more-pic').hide()
    })
  }
})
//End addNewPet
