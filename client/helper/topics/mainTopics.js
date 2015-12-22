////////////////// Golbel Section
Template.registerHelper('isBoxActive', function (data) {
  var container = data.hash.container
  var location = data.hash.location
  return Session.equals(container,location) ? 'topics-box-active' : ''
})

////////////////// mainTopics
Template.mainTopics.onCreated(function () {
  Session.set('topicsContainer','vetArticle')
  Session.set('vetArticleContainer','basic-pet-care')
  Session.set('sosContainer','lost-and-found')
  Session.set('identifyContainer', 'sosIdentify')
  Session.set('newsContainer', 'about-pet')
})

//mainTopics Helpers
Template.mainTopics.helpers({
  topicsContainer: function () {return Session.get('topicsContainer')},
  isMenuActive: function (location) {
    return Session.equals('topicsContainer', location) ? 'topics-menu-active' : ''
  }
})

//mainTopics Events
Template.mainTopics.events({
  'click #vet-article' : function () {Session.set('topicsContainer','vetArticle')},
  'click #sos' : function () {Session.set('topicsContainer','sos')},
  'click #news' : function () {Session.set('topicsContainer','news')},
  'click #pet-story' : function () {Session.set('topicsContainer','petStory')},
  'click #qna' : function () {Session.set('topicsContainer','qna')}
})


///////////////// vetArticle
//vetArticle Helpers
Template.vetArticle.helpers({
  vetArticleContainer: function () {return Session.get('vetArticleContainer')},
  vetArticleCurrentLocation: function () {
    var id = '#'+Session.get('vetArticleContainer')
    return $(id).text() || "Basic Pet Care"
  },
})
//vetArticle Events
Template.vetArticle.events({
  'click #basic-pet-care' : function () {Session.set('vetArticleContainer','basic-pet-care')},
  'click #disease-and-prevention' : function () {Session.set('vetArticleContainer','disease-and-prevention')},
  'click #vet-story' : function () {Session.set('vetArticleContainer','vet-story')}
})



///////////////// sos
//SOS Rendered
Template.sos.onRendered(function () {
  $('[name=id-card-number]').numeric()
  $('[name=tel-number]').numeric()
})
//sos Helpers
Template.sos.helpers({
  sosContainer: function () {return Session.get('sosContainer')},
  identifyContainer : function () { return Session.get('identifyContainer') }
})
//sosIdentify
Template.sosIdentify.helpers({
  sosCurrentLocation: function () {
    var id = '#'+Session.get('sosContainer')
    return $(id).text() || "Lost & Found"
  }
})
//sos Events
Template.sos.events({
  'click #lost-and-found': function () {Session.set('sosContainer', 'lost-and-found')},
  'click #blood-donation': function () {Session.set('sosContainer', 'blood-donation')},
  'click #new-home': function () {Session.set('sosContainer', 'new-home')},
  'click #fund-raising': function () {Session.set('sosContainer', 'fund-raising')},
  'click #verify-btn':function (e) {
    var idCard = $('[name=id-card-number]').val(),
        telNumber = $('[name=tel-number]').val()
    if(idCard !== "" && telNumber !== ""){
      Meteor.call('verifyIdCard', idCard, telNumber, function (err, res) {
        if(res) Session.set('identifyContainer', 'postBlock')
      })
    }
  }
})

////////////////  news
//news helpers
Template.news.helpers({
  newsContainer: function () { return Session.get('newsContainer') },
  newsCurrentLocation: function () {
    var id = '#'+Session.get('newsContainer')
    return $(id).text() || "About Pet"
  }
})
//news Events
Template.news.events({
  'click .topics-menu-box': function (e) {
    var id = $(e.target).attr('id')
    Session.set('newsContainer', id)
  }
})
