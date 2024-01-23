const nodemailer = require("nodemailer");

let mailTranspotar = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harshilsarariya@gmail.com",
    pass: "mhtuomerhgtwskba",
  },
});

 const sendMail = async (to, subject, message) => {
  let details = {
    from: "harshilsarariya@gmail.com",
    to: to,
    subject: subject,
    html: message,
  };

  await mailTranspotar.sendMail(details, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendMail;
