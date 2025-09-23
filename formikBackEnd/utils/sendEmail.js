const nodemailer = require("nodemailer");
async function sendEmail({ to, subject, text }) {
  // Determine email service from recipient
  let service;
  if (to.endsWith("@gmail.com")) {
    service = "gmail";
  } else if (to.endsWith("@yahoo.com")) {
    service = "yahoo";
  } else if (to.endsWith("@hotmail.com") || to.endsWith("@outlook.com")) {
    service = "hotmail";
  } else {
    throw new Error("Unsupported email provider");
  }

  //create transporter

  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user: process.env.EMAIL_USER, // your email for that service
      pass: process.env.EMAIL_PASS, // app password for that email
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to} using ${service}`);
}

module.exports = sendEmail;
