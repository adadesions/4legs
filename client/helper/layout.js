Template.layout.onRendered(function () {
  Tracker.autorun(function () {
    var currentRoute = Router.current().route.getName();
    if(currentRoute === "login"){
      $('body').addClass('bg-login');
    }
    else{
      $('body').removeClass('bg-login');
    }
  })
})
