var newPost = {comments : [], likes : [], shares : [], favorites : [], catagory : []}
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
Template.adminNews.onDestroyed(function () {
  Session.set('adminNewsContainer',null)
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
Template.adminArticle.onRendered(function () {
  Session.set('adminNewsContainer', null)
  Session.set('adminArticleContainer', 'basic-pet-care')
})

Template.adminArticle.onDestroyed(function () {
  Session.set('adminArticleContainer', null)
})

Template.adminArticle.helpers({
  adminArticleContainer: function () {return Session.get('adminArticleContainer')},
  petImgs: function () {return _.toArray(petImgs)}
})
Template.adminArticle.events({
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
    Session.set('adminArticleContainer',id)
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
        msg = `เลขที่ใบอนุญาตประกอบวิชาชีพสัตว์แพทย์ : ${vetId}  ชื่อ-สกุล ภาษาไทย : ${vetName} ${vetLastName}`
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

Template.postBlockAdmin.events({
  'click .btn-post' : function (e) {
    e.preventDefault();
    if(!($('[name=upload]')[0].files[0])){
      toastr.error("Please, upload a picture for you post.")
    }
    else{
      var path = Router.current().location.get().path
          path = path.slice(1,path.length)
      if(path === 'adminsite/superuser'){
        let catagory = ''
        if(Session.get('adminNewsContainer')) catagory = Session.get('adminNewsContainer')
        else if(Session.get('adminArticleContainer')) catagory = Session.get('adminArticleContainer')
        else catagory = Session.get('story')

        newPost.catagory.push(catagory)
        newPost.catagory.push('topics')
      }
      if(Session.get('identifyContainer') === 'postBlock') newPost.catagory.push(Session.get('sosContainer'))
      newPost.catagory.push(path)
      newPost.highlight = false
      newPost.info = {
         postOwner : Meteor.userId(),
         postBody : $('[name=newStatus]').val(),
         petType : Session.get('adminPetType'),
         createdAt : new Date()
      }
      Posts.insert(newPost, function (err) {
        if (err) throw err;
        else{

          $('[id^="medium-editor"]').empty()
          $('.new-upload-preview').empty()
          newPost.catagory = []
          Session.set('identifyContainer', 'sosIdentify')
          toastr.success('Your post is online!')
        }
      });
    }
  },

  'change [name=upload]' : function (e, template) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          newPost.img = {'_id': fileObj._id}
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.new-upload-preview')
      var img = document.createElement("img")
      img.file = $('[name=upload]')[0].files[0]
      img.classList.add('ui','centered','medium','image')

      if(uploadPicture.children().length == 0)
       uploadPicture.append(img)
      else
       uploadPicture.children().replaceWith(img)

      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    })
  },

  'click #photo-upload': function (e) {
    $('.new-upload').trigger('click')
  },

  'click .add-more-pic' : function (e) {
    $('[name=upload]').click()
  },
  'click .preview-img' : function (e) {
    $('[name=upload]').click()
  },
  'click #toggleBold' : function (e) {
    $('button#toggleBold').toggleClass("toggle")
  },
  'click #toggleItalic' : function (e) {
    $('button#toggleItalic').toggleClass("toggle")
  },
  'click #toggleUnderline' : function (e) {
    $('button#toggleUnderline').toggleClass("toggle")
  },
  'click #toggleHeader' : function (e) {
    $('button#toggleHeader').toggleClass("toggle")
  },
})

Template.postBlockAdmin.helpers({
  isAdminUpload: function () {
  return isAdminSite('admin-upload-picture')
},
isAdminStatus: function () {
  return isAdminSite('admin-status-form')
},
isAdminMorePic: function () {
  return isAdminSite('admin-add-more-pic')
},
postBlockFormData: function () {
  return {
    ownerId: Meteor.userId(),
    ownerName: Meteor.user().username
  }
},
postBlockUpload: function () {
  return {
    formData: function (index,fileInfo,formFields) {
      return {
        albums: 'postblock',
        userId: Meteor.userId()
      }
    },
    finished: function(index,fileInfo,formFields) {
      console.log(fileInfo);
    }
  }
},
})

/////adminLocation
Template.adminLocation.helpers({
  getVerifiedLocation: function () {
    return Markers.find({'owner.verified': true}).fetch()
  },
  getWaitingLocation: function () {
    return Markers.find({'owner.verified': false}).fetch()
  },
  getPromotingLocation: function () {
    return Markers.find({'promoting': true}).fetch()
  },
  getNumberVerifiedLocation: function () {
    return Markers.find({'owner.verified': true}).count()
  },
  getNumberWaitingLocation: function () {
    return Markers.find({'owner.verified': false}).count()
  },
  getNumberPromotingLocation: function () {
    return Markers.find({'promoting': true}).count()
  }
})
Template.adminLocation.events({
  'click #verifyBtn, click .admin-location-item-block': function (e) {
    let markerId = $(e.target).data('id') || $(e.target).attr('id'),
        marker = Markers.findOne({_id:markerId}),
        locationName = marker.locationName,
        ownerName = marker.owner.ownerName,
        ownerEmail = marker.owner.ownerEmail,
        ownerTel = marker.owner.ownerTel,
        msg = `กดอนุมัติเพื่อยืนยันว่า ${ownerName} เป็นเจ้าของ ${locationName} นี้จริง`
    let confirm = new Confirmation({
      message: msg,
      title: "Confirmation",
      cancelText: "ไม่อนุมัติ",
      okText: "อนุมัติ",
      success: true
    }, function (ok) {
        if(ok) {
          Meteor.call('updateLocationVerify',markerId,true, function (err) {
            if(err){
              throw err
              toastr.error('Can not verify this location on this time')
            }
            else toastr.success("You've verified this location")
          })
        }
        else{
          Meteor.call('updateLocationVerify',markerId,false, function (err) {
            if(err){
              throw err
              toastr.error('Can not do the action to this location on this time')
            }
            else toastr.success("You've unverified this location")
          })
        }
    })
  }
})


Template.adminLocationItem.helpers({
  buttonState: function (obj) {
    let marker = obj,
        buttonInfo = [
          {_id:obj._id, idName:'promoteBtn', color:'blue', content: 'Promote'},
          {_id:obj._id, idName:'verifyBtn', color:'green', content: 'Verify'},
          {_id:obj._id, idName:'stopBtn', color:'red', content: 'Stop'},
        ]
    if(!marker.owner.verified) return buttonInfo[1]
    else if(marker.owner.verified && marker.promoting) return buttonInfo[2]
    else return buttonInfo[0]

  }
})

Template.adminLocationItem.events({
  'click #promoteBtn': function (e) {
    let markerId = $(e.target).data('id')
    Markers.update({_id:markerId},{$set: {promoting: true}})
  },
  'click #stopBtn': function (e) {
    let markerId = $(e.target).data('id')
    Markers.update({_id:markerId},{$set: {promoting: false}})
  }
})


//adminStory
Template.adminStory.onRendered(function () {
  Session.set('story', 'pet-story')
})

Template.adminStory.onDestroyed(function () {
  Session.set('story', null)
})
