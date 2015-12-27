var newPost = {comments : [], likes : [], shares : [], favorites : [], catagory : []}

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

       newPost.info = {
          postOwner : Meteor.userId(),
          postBody : $('[name=newStatus]').val(),
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
})

function isAdminSite(adminClass) {
  return Router.current().route.getName() === 'superuser' ? adminClass : ''
}
