Pets = new Mongo.Collection('pets');
var petsModel = {
  petOwner : "Nn7xjhooBp4aWJqRW",
  petName : "Snowy-x13",
  type : "Dog",
  species : "Pomerinian",
  gender: "Male",
  birthday : new Date(),
  detail : "Some string goes here maybe I will limit a length of this string not too far or not I'm not sure.",
  img_id : ""
}

Meteor.methods({
  'insertNewPet' : function (newPet) {
    Pets.insert(newPet)
  },
  'deletePet' : function (id) {
    Pets.remove({_id:id})
  },
  'updatePet': function (id, myPet) {
    Pets.update({_id:id}, {$set:{
        'info.petName': myPet.info.petName,
        'info.type': myPet.info.type,
        'info.species': myPet.info.species,
        'info.gender': myPet.info.gender,
        'info.birthday': myPet.info.birthday,
        'info.detail': myPet.info.detail,
        'img._id': myPet.img
      }
    })
  }
})
