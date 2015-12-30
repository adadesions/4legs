Meteor.methods({
  removePicture: function (id) {
    Images.remove({_id:id})
  }
})
