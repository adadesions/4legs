Template.layout.onRendered(function () {
  Tracker.autorun(function () {
    var currentRoute = Router.current().route.getName();
    if(currentRoute === "login" || currentRoute === "adminsite"){
      $('body').addClass('bg-login');
    }
    else{
      $('body').removeClass('bg-login');
    }
  })
})
