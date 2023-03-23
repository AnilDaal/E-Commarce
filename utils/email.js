import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // nodemailer.createTestAccount.createTestAccount();
  // 1) Create a transporter
  //   const transporter = nodemailer.createTransport({
  //     service: "Gmail",
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: "Anil Daal <anildaal7@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
