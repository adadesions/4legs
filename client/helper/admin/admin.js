Template.admin.helpers({
  getEmail: function () {
    return Meteor.user().emails[0].address
  }
})

Template.admin.events({
  'click .btn-myLogin': function (e) {
    e.preventDefault();
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(username, password, function (err) {
      if (err) {
          toastr.error("Your Username or Password is incorrect")
          throw new Meteor.Error("login failed");
      }
      else{
        Meteor.users.update({_id:Meteor.userId()},{
          $set: {
            'profile.asAdmin': {
              loggedIn: true,
              loggedInAt: new Date()
            }
          }
        })
        Router.go('superuser');
      }
    })
  }
})

//adminLayout
Template.adminLayout.events({
  'click #adminLogOut': function () {
    Meteor.users.update({_id:Meteor.userId()}, {$set: {'profile.asAdmin.loggedIn': false}})
    Router.go('newsfeed')
  }
})

//Superuser
Template.superuser.onCreated(function () {
  Session.set('superuserContainer','adminNews')
})
Template.superuser.helpers({
  superuserContainer: function () { return Session.get('superuserContainer')}
})

//adminNews
Template.adminNews.onRendered(function () {
  let $target = $('.admin-catagory-item > img').first()
  $target.addClass('act-active')
  setImgSrc($target,'activeUrl')
  //Session Set
  Session.set('adminPetType', 'dog')
  Session.set('adminNewsContainer','about-pet')
})

Template.adminNews.helpers({
  adminNewsContainer: function () {return Session.get('adminNewsContainer')},
  petImgs: function () {return _.toArray(petImgs)}
})
Template.adminNews.events({
  'click .admin-catagory-item': function (e) {
    let $target = $(e.target)
    //Reset state
    $('.admin-catagory-item').filter(function (index) {
      if($(this).children().hasClass('act-active')){
        $(this).children().removeClass('act-active')
        setImgSrc($(this).children(),'passiveUrl')
      }
    })
    //Target
    $target.addClass('act-active')
    setImgSrc($target,'activeUrl')
  },
  'click .topics-menu-box': function (e) {
    let id = $(e.target).attr('id')
    Session.set('adminNewsContainer',id)
  }
})

function setImgSrc($target,urlType) {
    let id = $target.closest('div').attr('id')
    let src = petImgs[id][urlType]
    $target.attr('src',src)
    Session.set('adminPetType',id)
}
