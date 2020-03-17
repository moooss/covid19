var mailer = require("nodemailer");

function sendmail () {
  var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "bartonf0nk@gmail.com",
      pass: "!!fantomas"
    }
  });
  
  var mail = {
    from: "bartonf0nk@gmail.com",
    to: "m.mousnier@gmail.com",
    subject: "Email from nooOoode",
    html: "Incrediblous !"
  }
  
  smtpTransport.sendMail(mail, function(error, response){
    if(error){
      console.log("Erreur lors de l'envoie du mail!");
      console.log(error);
    }else{
      console.log("Mail envoyé avec succès!")
    }
    smtpTransport.close();
  });
}

module.exports = sendmail
