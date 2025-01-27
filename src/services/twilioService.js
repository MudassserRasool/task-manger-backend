import twilio from 'twilio';
import {
  twilioAuthToken,
  twilioSenderPhoneNumber,
  twilioSID,
} from '../constants/environment.js';
const sendSmsOtp = async (toPhone, otp) => {
  const client = twilio(twilioSID, twilioAuthToken);
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioSenderPhoneNumber,
      to: toPhone,
    });
    return otp;
  } catch (error) {
    throw new Error(error.message);
  }
};

const twilioService = {
  sendSmsOtp,
};

export default twilioService;
