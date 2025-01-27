import admin from '../config/firebaseConfig.js';

/**
 * Send OTP via Firebase SMS
 * @param {string} phoneNumber - The phone number in E.164 format (e.g., +1234567890)
 * @param {string} message - Custom message to include with the OTP
 * @returns {Promise<string>} - Resolves with the OTP sent
 */
async function sendOtpToPhone(phoneNumber, otp) {
  const mess = '';
  const fullMessage = `${mess} ${otp}`;

  try {
    await admin.messaging().send({
      notification: {
        title: 'Verification Code',
        body: fullMessage,
      },
      token: phoneNumber, // Use this for testing with FCM or integrate with a proper SMS gateway
    });
    return otp; // Return the generated OTP
  } catch (error) {
    console.log('--------------------------------------');
    console.log(error);
    console.log('--------------------------------------');

    throw new Error('Failed to send OTP', error);
  }
}

const firebaseService = {
  sendOtpToPhone,
};

export default firebaseService;
