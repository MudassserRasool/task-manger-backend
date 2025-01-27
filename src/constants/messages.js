const messages = {
  // ------------------------------Auth--------------------------------
  INVALID_CREDENTIALS: 'Invalid credentials please try again',
  NOT_VERIFIED_USER:
    'THis user is already registered but  not verified please verify your email',
  ALREADY_EXIST_USER: 'User already exists please login',
  NOT_FOUND_USER: 'User does not found please register',
  VERIFIED_PLEASE_LOGIN: 'User is already verified please login',
  PLEASE_REGISTER: 'User is not registered please register first',
  ACCOUNT_VERIFIED: 'Your OTP is verified',
  INVALID_OTP: 'Invalid OTP please try again',
  PASSWORD_RESET: 'Password reset successfully',
  OTP_SENT: 'An otp is  successfully sent to you email',
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_DELETED: 'User deleted successfully',
  ACCOUNT_VERIFIED: 'Account verified successfully',
  OTP_SENT: 'OTP sent successfully',
  BLOCKED_USER: 'User is blocked by admin',
  USER_UPDATED: (isBlocked) =>
    `User ${isBlocked ? 'blocked' : 'unblocked'}  successfully`,

  // validation messages
  INVALID_EMAIL: 'Please enter a valid email',
  INVALID_PASSWORD: 'Password must be at least 6 characters long',
  INVALID_NAME: 'Please enter a valid name',
  MISSING_FIELDS: 'Please enter all the required input fields',
  OTP_NOT_VERIFIED: 'OTP is not verified',

  // ------------------------------Subscription--------------------------------
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  GET_ALL_SUBSCRIPTIONS: 'All subscriptions fetched successfully',
  GET_SINGLE_SUBSCRIPTION: 'Subscription fetched successfully',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully',
  SUBSCRIPTION_DELETED: 'Subscription deleted successfully',
};

export default messages;
