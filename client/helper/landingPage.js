Template.landingPage.onRendered(function () {
  $('#loginLandingPage')
  .popup({
    popup : $('.custom.popup'),
    on    : 'click',
    position : 'bottom right'
  })
})
