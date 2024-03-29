Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction(function () {
  var path = Router.current().route.getName();
  var exceptList = ['specLocation','register', 'login', 'mainTopics', 'location']
  var checkedList = !(_.contains(exceptList, path))
  var isPost = path.indexOf('specPost') > -1
  if (!Meteor.userId() && checkedList && !isPost) this.redirect('landingPage')
  else if(Meteor.userId() && path === 'register') this.redirect('/newsfeed')
  this.next()
})

Router.onAfterAction(function () {
  if(this.ready())
    Meteor.isReadyForSpiderable = true
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
    let post = Posts.findOne({_id: this.params.id}),
        owner = Meteor.users.findOne({_id: post.info.postOwner}).username,
        img = Images.findOne({_id:post.img._id}),
        body = (function () {
          const keywords = ['<strong>','</strong>','<ins>','</ins>']
          let postBody = post.info.postBody
          if(postBody.includes('</')){
            postBody = postBody.replace(/\u002f/g, '')
            .replace(/<a|href="*|<strong>|<ins>|<h2>|<h3>|<b>|<p>|<i>|<br>|<u>|<blockquote>/g, '')
          }
          return postBody
        })()

    Meta.setTitle(`${owner}'s post`)
    Meta.set([
      {
        name: 'property',
        property: 'og:title',
        content: `${owner}'s post`
      },
      {
        name: 'property',
        property: 'og:description',
        content: body
      },
      {
        name: 'property',
        property: 'og:image',
        content: `https://4kha.com${img.url()}`
      }
    ])
    this.render('specPost', {data:post})
}, {name: 'specPost'})

Router.route('/location', {
  name: 'location',
  fastRender: true
})

Router.route('/specLocation/:id', function () {
  let marker = Markers.findOne({_id: this.params.id}),
      img = Images.findOne({_id:marker.photos._id})

  Meta.setTitle(`${marker.locationName}`)
  Meta.set([
    {
      name: 'property',
      property: 'og:title',
      content: `${marker.locationName}`
    },
    {
      name: 'property',
      property: 'og:description',
      content: `${marker.detail}`
    },
    {
      name: 'property',
      property: 'og:image',
      content: `https://4kha.com${img.url()}`
    }
  ])
  this.render('specLocation', {data:marker})
}, {name: 'specLocation'})

Router.route('/adminsite',
  {
    name:'admin',
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
}, {name:'superuser'})

Router.route('feedback', {
  name: 'feedback',
})

Router.route('addFollow', {
  name: 'addFollow',
})

Router.route('favoritePlace', {
  name: 'favoritePlace',
})
