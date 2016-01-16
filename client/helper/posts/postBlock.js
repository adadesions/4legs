var newPost = {comments : [], likes : [], shares : [], favorites : [], catagory : []}

Template.postBlock.onRendered(function () {
  $('textarea').elastic()
})

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
           var upload = '<div class="col-lg-4 text-bottom upload-group"><input type="file" name="upload" id="file" class="upload-img"></div><div class="add-more-pic col-lg-6 text-center" ><i class="fa fa-plus fa-5x"></i></div>'
           $('[name=newStatus]').val('')
           $('.upload-picture').empty().append(upload)
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

   'click .add-more-pic' : function (e) {
     $('[name=upload]').click()
   },
   'click .preview-img' : function (e) {
     $('[name=upload]').click()
   }
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
  }
})

function isAdminSite(adminClass) {
  return Router.current().route.getName() === 'superuser' ? adminClass : ''
}
