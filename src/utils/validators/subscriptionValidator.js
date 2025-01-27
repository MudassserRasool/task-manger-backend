import ExceptionHandler from '../error.js';

class SubscriptionValidator {
  validateSubscription(subscriptionData) {
    if (!subscriptionData.title) {
      ExceptionHandler.BadRequest('Name is required');
    }
    if (!subscriptionData.price) {
      ExceptionHandler.BadRequest('Price is required');
    }
  }
  validateUserPurchaseSubscription(subscriptionData) {
    if (!subscriptionData.subscriptionId) {
      ExceptionHandler.BadRequest('Subscription Id is required');
    }
    if (!subscriptionData.stripeSessionId) {
      ExceptionHandler.BadRequest('Stripe Session Id is required');
    }
    if (!subscriptionData.amount) {
      ExceptionHandler.BadRequest('Amount is required');
    }
  }
}
const subscriptionValidator = new SubscriptionValidator();
export default subscriptionValidator;
