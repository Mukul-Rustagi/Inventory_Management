const nodemailer = require('nodemailer');

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service (e.g., SendGrid, Mailgun, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email account
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
