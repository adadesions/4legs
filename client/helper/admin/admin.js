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
  },

})

//adminLayout
Template.adminLayout.events({
  'click #adminLogOut': function () {
    Meteor.users.update({_id:Meteor.userId()}, {$set: {'profile.asAdmin.loggedIn': false}})
    Session.set('superuserContainer','')
    Session.set('adminPetType', '')
    Session.set('adminNewsContainer','')
    Router.go('newsfeed')
  },
  'click .admin-nav-item, click .admin-nav-label': function (e) {
    let id = $(e.target).attr('id')
    id !== 'adminLogOut' ? Session.set('superuserContainer',id) : ''
  }
})

//Superuser
Template.superuser.onCreated(function () {
  Session.set('superuserContainer','adminVet')
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

//adminVet
Template.adminVet.helpers({
  getVet: function () {
    return Meteor.users.find({'profile.vetInfo.isVet': true, 'profile.vetInfo.verified': false})
  },
  getVerifiedVet: function () {
    return Meteor.users.find({'profile.vetInfo.verified': true})
  },
  getNumberVerifiedVet: function () {
    return Meteor.users.find({'profile.vetInfo.isVet': true, 'profile.vetInfo.verified': true}).count()
  },
  getNumberWaitingVet: function () {
    return Meteor.users.find({'profile.vetInfo.isVet': true, 'profile.vetInfo.verified': false}).count()
  }
})

Template.adminVet.events({
  'click .adminVet-item-block': function (e) {
    let userId = $(e.target).attr('id'),
        user = Meteor.users.findOne({_id:userId}),
        vetId = user.profile.vetInfo.vetId,
        vetName = user.profile.vetInfo.vetName,
        vetLastName = user.profile.vetInfo.vetLastName,
        msg = `เลขที่ใบอนุญาติประกอบวิชาชีพสัตว์แพทย์ : ${vetId}  ชื่อ-สกุล ภาษาไทย : ${vetName} ${vetLastName}`
    let confirm = new Confirmation({
      message: msg,
      title: "Confirmation",
      cancelText: "ไม่อนุมัติ",
      okText: "อนุมัติ",
      success: true
    }, function (ok) {
        if(ok) {
          Meteor.call('updateVetVerify',userId,true, function (err) {
            if(err){
              throw err
              toastr.error('Can not verify this person on this time')
            }
            else toastr.success("You've verified this person as Veterinary")
          })
        }
        else{
          Meteor.call('updateVetVerify',userId,false, function (err) {
            if(err){
              throw err
              toastr.error('Can not do the action to this person on this time')
            }
            else toastr.success("You've unverified this person as Veterinary")
          })
        }
    })
  }
})

//AdminAds
Template.adminAds.helpers({
  getAdsCard: function () {
    return Ads.find()
  }
})
