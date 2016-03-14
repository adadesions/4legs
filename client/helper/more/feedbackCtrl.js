Template.feedback.events({
  'click .send-feedback': function () {
    let feedback = $('textarea').val(),
        userId = Meteor.userId(),
        feedbackObj = {
          feedback,
          userId
        }
    Feedback.insert(feedbackObj, function (err) {
      if(err) toastr.error("Sorry, you can not send a feedback on this time")
      else toastr.success("Thank you for your feedback and we will alway improve our services for you")
    })
    $('textarea').val('')
  },
  'click .clear': function () {
    $('textarea').val('')
  }
})
