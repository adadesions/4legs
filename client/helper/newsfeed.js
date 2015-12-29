Template.newsfeed.helpers({
  getAdsLimit:function (num) {
    return Ads.find({},{limit: parseInt(num)})
  }
})
