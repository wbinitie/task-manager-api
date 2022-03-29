const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USER,
    pass: process.env.PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

const sendWelcomeEmail = (email, name) => {
  const options = {
    from: "binitiewilliam0511@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Thanking for joining in!", // Subject line
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`, // plain text body
    //   html: "<b>Hello world?</b>", // html body
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log("Error: " + err);
      return;
    }
    console.log("Sent: " + info.messageId);
  });
};

const sendCancellationEmail = (email, name) => {
  const options = {
    from: "binitiewilliam0511@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Your account has been canceled. We are sad to see you leave.", // Subject line
    text: `Hi ${name},\nThis email confirms that your account has been canceled.\nWe're really sorry to see you leave, but thanks for giving us a try.`, // plain text body
    //   html: "<b>Hello world?</b>", // html body
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log("Error: " + err);
      return;
    }
    console.log("Sent: " + info.messageId);
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
