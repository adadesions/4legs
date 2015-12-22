var imageStore = new FS.Store.GridFS("images")
// var temp = new FS.Store.FileSystem("local_images", {path: "~/uploads"})

Images = new FS.Collection("images", {
  stores : [imageStore],
  filter : {
    allow : {
      contentTypes : ['image/*']
    }
  }
})
