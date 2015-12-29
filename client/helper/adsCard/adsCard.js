let newAds = {}

Template.adsCreateCard.onRendered(function () {
  Session.set('createCard','createCardStep1')
})

Template.adsCreateCard.helpers({
  createCard: function () { return Session.get('createCard')}
})

Template.adsCreateCard.events({
  'click .new-ads-btn': function (e) {
    Session.set('createCard','createCardStep2')
    $('.adminAds-card-create').css("height","auto")
  },
  'click .add-more-pic': function (e) {
    $('[name=upload]').click()
  },
  'click #cancel': function (e) {
    Session.set('createCard','createCardStep1')
  },
  'change [name=upload]' : function (e, template) {
    FS.Utility.eachFile(e, function (file) {
      Images.insert(file, function (err, fileObj) {
        if(err){
          toastr.error("Upload failed... please try again.")
        }else{
          newAds.img = {'_id': fileObj._id}
          toastr.success('Upload succeeded!')
        }
      })
      var uploadPicture = $('.upload-picture')
      var img = document.createElement("img")
      img.file = $('[name=upload]')[0].files[0]
      img.onload = function () {
               if(this.width > this.height) img.classList.add('preview-img-gtwidth')
               else img.classList.add('preview-img-gtheight')
           };
      img.classList.add('preview-img')
      var preview = $('.preview-img')

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

      $('.upload-group, .add-more-pic').hide()
    })
  },
  'click #confirm': function (e) {
    let cardHeader = $('[name=card-header]').val(),
        cardDetail = $('[name=card-detail]').val(),
        cardUrl = $('[name=card-url]').val()

    newAds.info = {
      cardHeader,
      cardDetail,
      cardUrl
    }
    //insert new ads
    Ads.insert(newAds)
    //Reset form
    $('[name=card-header]').val('')
    $('[name=card-detail]').val('')
    $('[name=card-url]').val('')
    //Return to step 1
    Session.set('createCard','createCardStep1')
  }
})

Template.adsCard.events({
  'click .delete-ads': function (e) {
    let adsId = $(e.target).attr('id')
    let confirm = new Confirmation({
      message: "Are you sure to remove this ads?",
      title: "Delete this Ads",
      cancelText: "ยกเลิก",
      okText: "ลบ",
      success: true
    }, function (ok) {
        if(ok) {
          Ads.remove({_id:adsId}, function (err) {
            if(err) toastr.error("Can not remove this ads right now!")
            else toastr.success("The ads was deleted by admin")
          })
        }
    })
  }
})
