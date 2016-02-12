Images = new FS.Collection("images", {
  stores : [
    new FS.Store.GridFS("images", {
      beforeWrite: function (fileObj) {
        return {
          extension: 'jpeg',
          type: 'image/jpeg'
        }
      },
      transformWrite: resizeImageStream({
        width: 960,
        height: 560,
        format: 'image/jpeg',
        quality: 50
      })
    })
  ],
  filter : {
    allow : {
      contentTypes : ['image/*']
    }
  }
})
