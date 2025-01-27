import { createTransporter } from '../utils/helper.js';

const sendEmail = async (email, otp) => {
  // Prepare email options
  const mailOptions = {
    to: email,
    from: `"Foodie" <mudasserasool@gmail.com>`,
    subject: 'OTP for account verification',
    text: otp.toString(),
  };
  // Send email
  const sendMail = async (mailOptions) => {
    const transporter = createTransporter();

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve('Email sent successfully: ' + info.response);
        }
      });
    });
  };

  try {
    await sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

const emailService = {
  sendEmail,
};

export default emailService;
