// Meteor.methods({
//   sendEmail: function (to, from, subject, text) {
//     check([to, from, subject, text], [String]);
//     console.log(to+","+form)
// // Let other method calls from the same client start running,
// // without waiting for the email sending to complete.
//     this.unblock();
//
//     Email.send({
//       to: to,
//       from: from,
//       subject: subject,
//       text: text
//     });
//   }
// });

Accounts.emailTemplates.siteName = "AwesomeSite";
Accounts.emailTemplates.from = "AwesomeSite Admin <accounts@example.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Awesome Town, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};
