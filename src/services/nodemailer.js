import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

const emailHtmlContent = `
  <h1>Coderhouse Backend II/h1>
  <p>Enviado desde nodemailer</p>
  <p><b>Codehourse backend II , entrega final.</b></p>
`;

export const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info.response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
