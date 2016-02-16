Template.likeBtn.onRendered(function () {

  $('.like-hover')
  .popup({
    popup : $('.popup-like.popup'),
    target: '.like-hover',
    position : 'top left'
  })

})
