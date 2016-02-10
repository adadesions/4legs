Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction(function () {
  var path = Router.current().route.getName();
  var exceptList = ['register', 'login', 'mainTopics', 'location']
  var checkedList = !(_.contains(exceptList, path))
  var isPost = path.indexOf('specPost') > -1  
  if (!Meteor.userId() && checkedList && !isPost) this.redirect('landingPage')
  else if(Meteor.userId() && path === 'register') this.redirect('/newsfeed')
  this.next()
})

Router.route('/', {
  path: '/',
  name: 'landingPage',
  layoutTemplate: 'homePage',
  onBeforeAction : function () {
    if(Meteor.userId()) this.redirect('/newsfeed')
    this.next()
  }
})

Router.route('/login', {
  path: '/login',
  name: 'login',
  onBeforeAction: function () {
  }
})

Router.route('/register', {name: 'register'})
Router.route('/newsfeed', {
  path: '/newsfeed',
  name: 'newsfeed',
  fastRender: true
})
Router.route('/profile/:id', function () {
  var user = Meteor.users.findOne({_id : this.params.id})
  this.render('profile', {data:user})
},{name: 'profile'})
Router.route('/editProfile', {name: 'editProfile'});
Router.route('/favoritetopics', {name: 'FavoriteTopics'})
Router.route('/topics', {name: 'mainTopics'})
Router.route('/notification', {name: 'notification'})
Router.route('/post/:id', function () {
    var post = Posts.findOne({_id: this.params.id})
    this.render('specPost', {data:post})
},{name: 'specPost'})

Router.route('/location', {name: 'location',fastRender: true})

Router.route('/adminsite',
  {
    name:'admin',
    fastRender: true,
    onBeforeAction : function () {
      if(Meteor.user() && Meteor.user().profile.asAdmin){
        if(Meteor.user().profile.asAdmin.loggedIn)
          this.redirect('/adminsite/superuser')
      }
      else if(Meteor.user() && Meteor.user().profile.privileged) this.render('admin')
      else this.redirect('/')
      this.next()
    }
  }
)

Router.route('/adminsite/superuser',function () {
  this.layout('adminLayout')
  this.render('superuser')
}, {fastRender: true, name:'superuser'})

Router.route('feedback', {
  name: 'feedback',
})

Router.route('addFollow', {
  name: 'addFollow',
})

Router.route('favoritePlace', {
  name: 'favoritePlace',
})
