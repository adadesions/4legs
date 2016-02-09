var newPost = {comments : [], likes : [], shares : [], favorites : [], catagory : []}
var textEdit = ""
Template.postBlock.events({

   'click .btn-post' : function (e) {
     e.preventDefault();
     if(!($('[name=upload]')[0].files[0])){
       toastr.error("Please, upload a picture for you post.")
     }
     else{
       var path = Router.current().location.get().path
           path = path.slice(1,path.length)
       if(path === 'adminsite/superuser') newPost.catagory.push(Session.get('adminNewsContainer'))
       if(Session.get('identifyContainer') === 'postBlock') newPost.catagory.push(Session.get('sosContainer'))
       newPost.catagory.push(path)
       newPost.highlight = false
       newPost.info = {
          postOwner : Meteor.userId(),
          postBody : $('[name=newStatus]').val(),
          petType : Session.get('adminPetType'),
          createdAt : new Date(),
       }
       Posts.insert(newPost, function (err) {
         if (err) throw err;
         else{
           $('[name=newStatus]').val('')
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

Template.postBlock.helpers({

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

function isAdminSite(adminClass) {
  return Router.current().route.getName() === 'superuser' ? adminClass : ''
}
