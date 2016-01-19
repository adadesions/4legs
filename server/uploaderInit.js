// Meteor.startup(function () {
//   UploadServer.init({
//     tmpDir: process.env.PWD + '/.uploads/tmp',
//     uploadDir: process.env.PWD + '/.uploads/',
//     checkCreateDirectories: true,
//     cacheTime: 100,
//     getFileName: function (fileInfo,formData) {
//       if(formData.albums === 'postblock') return 'pb-'+fileInfo.name
//       else return 'gen-'+fileInfo.name
//     },
//     getDirectory: function (fileInfo,formData) {
//       return formData.albums + '/' + formData.userId
//     }
//   })
// })
