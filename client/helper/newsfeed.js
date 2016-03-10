Template.newsfeed.helpers({
  getAdsLimit:function (num) {
    let adsList = Ads.find().fetch(),
        ranIndex1 = Math.floor(Math.random()*adsList.length),
        ranIndex2 = Math.floor(Math.random()*adsList.length),
        presentAds = []
    if(Ads.find().count() === 1){
      presentAds.push(adsList[ranIndex1])
      return presentAds
    }

    while(true){
      if(ranIndex1 === ranIndex2){
        ranIndex2 = Math.floor(Math.random()*adsList.length)
      }
      else break
    }
    presentAds.push(adsList[ranIndex1])
    presentAds.push(adsList[ranIndex2])
    return presentAds
  },
  hasHighlight: function () {
    let len = Posts.find({highlight:true}).count()
    return len === 1 ? true : false
  },
  isMobile: function () {
    const ratio = window.devicePixelRatio
    let width = window.screen.width*ratio,
        height = window.screen.heigh*ratio
    return width < 800 ? true : false
  }
})

Template.newsfeed.onRendered(function () {
  //SEO
  Meta.setTitle("Newsfeed")

  $('.ui.sticky').sticky({
    context: '.feed-container'
  })
})
