Session.set('sData', 'AdaDeSions')
Template.lab.helpers({
  sData : function () {return Session.get('sData')}
})
Template.lab.events({
  'click h1' : function () {
    Session.set('sData', 'Clicked')
  },
  'change [name=t_input]' : function () {
    var text = $('[name=t_input]').val()
    Session.set('sData', text)
  },
  'change [name=u_input]' : function () {
    var file = $('[name=u_input]')[0].files[0];
    Session.set('sData', file.name)
    var img = document.createElement("img")
    img.file = file
    $('body').append(img);

    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
})
