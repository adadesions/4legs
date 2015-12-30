Template.comment.helpers({
  enhanceTime : function (postTime) {
    var adjTime = moment(postTime);
    return adjTime.fromNow();
  }
})
