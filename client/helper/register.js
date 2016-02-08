let topicsData = [
  {
    value: 'สุนัข',
    imgUrl: '/images/object/2-signup/dog.png'
  },
  {
    value: 'แมว',
    imgUrl: '/images/object/2-signup/cat.png'
  },
  {
    value: 'pocket pet',
    imgUrl: '/images/object/2-signup/petpocket.png'
  },
  {
    value: 'นก',
    imgUrl: '/images/object/2-signup/bird.png'
  },
  {
    value: 'สัตว์เลื้อยคลาน',
    imgUrl: '/images/object/2-signup/turtle.png'
  },
  {
    value: 'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ',
    imgUrl: '/images/object/2-signup/fish.png'
  },
  {
    value: 'สถานพยาบาล',
    imgUrl: '/images/object/2-signup/clinic.png'
  },
  {
    value: 'บริการสัตว์เลี้ยง',
    imgUrl: '/images/object/2-signup/grooming.png'
  },
  {
    value: 'ร้านค้า',
    imgUrl: '/images/object/2-signup/shop-03.png'
  },
]
var profileImg = {}


Meteor.setInterval(function () {
    //Change confrim button state
    var state = [
      $('[name=username]').hasClass('input-success'),
      $('[name=email]').hasClass('input-success'),
      $('[name=password]').hasClass('input-success'),
      $('[name=re-password]').hasClass('input-success'),
      $('[name=birthday]').hasClass('input-success')
    ]
    if(_.indexOf(state, false) > -1) $('#signup-btn').addClass('disabled')
    else $('#signup-btn').removeClass('disabled')

}, 2000)

Template.register.onRendered(function () {
  Tracker.autorun(function () {
    Session.set('isVet',false)
  })
})

Template.register.rendered=function() {
    $('#birthday').datetimepicker({
      viewMode: 'years',
      format: 'DD/MM/YYYY'
    })
}

Template.register.helpers({
  topics : topicsData,
  isVet : function(){
    return Session.get('isVet')
  }
})

Template.register.events({
  'click #vet': function () {
    if(Session.get('isVet')) Session.set('isVet', false)
    else Session.set('isVet', true)
  },
  'click #signup-btn': function (e) {
    e.preventDefault();

    var username = $('[name=username]').val(),
        email = $('[name=email]').val(),
        password = $('[name=password]').val(),
        birthday = $('[name=birthday]').val(),
        topics = $('[name=topics]:checked').map(function () {
      return this.value;
    }).get();

    var isVet = $('[name=vet]:checked'),
        vetObj = {};
    if(isVet.length > 0){
        var vetId = $('[name=vet-id]').val(),
            vetName = $('[name=vet-name]').val(),
            vetLastName = $('[name=vet-lastname]').val();
        vetObj = {
          vetId,
          vetName,
          vetLastName,
          isVet: true,
          verified: false
        }
    }
    else vetObj = {isVet : false, verified: false}

      Accounts.createUser({
        username,
        email,
        password,
        profile: {
          birthday,
          topics,
          vetInfo : vetObj,
          image : profileImg,
          followers : [],
          following : [],
          asAdmin : {loggedIn: false},
          privileged: false
        }
      },function (err) {
        if(err){
          throw err
          toastr.error("May be your Username or Email is used by another user")
        }
        else Router.go('newsfeed')
      });
  },

  'change [name=upload]': function (e) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          profileImg = {'_id': fileObj._id}
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.upload-profile'),
          img = document.createElement("img"),
          preview = $('.preview-img')

      img.file = $('[name=upload]')[0].files[0]
      img.onload = function () {
               if(this.width > this.height) {
                 img.classList.add('preview-img-gtwidth-profile')
                 $('.upload-group-profile').css({"margin-top":"0","position":"relative"})
               }
               else{
                 img.classList.add('preview-img-gtheight-profile')
                 $('.upload-group-profile').css({"margin-top":"1em","position":"absolute"})
               }
           };
      img.classList.add('preview-img')
      img.classList.add('preview-for-profile')

      if(preview.length)
       preview.replaceWith(img)
      else
       uploadPicture.append(img)

      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    })
  },

  'change [name=re-password],[name=password]' : function (e) {
    var password = $('[name=password]'),
        rePassword = $('[name=re-password]')
    if(password.val() === rePassword.val()){
      password.removeClass('input-error').addClass('input-success')
      rePassword.removeClass('input-error').addClass('input-success')
    }
    else{
      password.removeClass('input-success').addClass('input-error')
      rePassword.removeClass('input-success').addClass('input-error')
    }
  },
  'keyup [name=username]' : function (e) {
    var username = $('[name=username]')
    if(username.val().length >= 4) username.removeClass('input-error').addClass('input-success')
    else username.removeClass('input-success').addClass('input-error')
  },
  'change [name=email]' : function (e) {
    var email = $('[name=email]'),
        value = email.val()
    if(value.indexOf('@') > -1 && value.indexOf('.') > -1) email.removeClass('input-error').addClass('input-success')
    else email.removeClass('input-success').addClass('input-error')
  },
  'change [name=birthday]' : function (e) {
    var birthday = $('[name=birthday]')
    if(birthday.val().length > 0) birthday.removeClass('input-error').addClass('input-success')
    else birthday.removeClass('input-success').addClass('input-error')
  },
})

//EditPofile VET
Template.editProfile.events({
  'click #vet': function () {
    if(Session.get('isVet')) Session.set('isVet', false)
    else Session.set('isVet', true)
  }
})

Template.editProfile.helpers({
  'isVet': function () {
    return Session.get('isVet')
  }
})
