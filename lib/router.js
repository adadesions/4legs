Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction(function () {
  var path = Router.current().route.getName();
  if (!Meteor.userId() && path !== 'register') this.render('login')
  else if(Meteor.userId() && path === 'register') this.render('newsfeed')
  else this.next();
})

Router.route('/', {
  name: 'login',
  onBeforeAction : function () {
    if(Meteor.userId()) Router.go('newsfeed')
    else this.next();
  }
});

Router.route('/register', {name: 'register'});
Router.route('/newsfeed', {
  name: 'newsfeed',
  fastRender: true
});
Router.route('/profile/:id', function () {
    var user = Meteor.users.findOne({_id : this.params.id})
    this.render('profile', {data:user})
  },
  {name: 'profile'}
);
Router.route('/editProfile', {name: 'editProfile'});
Router.route('/favoritetopics', {name: 'FavoriteTopics'})
Router.route('/topics', {name: 'mainTopics'})
Router.route('/notification', {name: 'notification'})
Router.route('/post/:id', function () {
    var post = Posts.findOne({_id: this.params.id})
    this.render('specPost', {data:post})
  },
  {name: 'specPost'}
)
Router.route('/location', {name: 'location'})
