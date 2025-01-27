import messages from '../constants/messages.js';
import subscriptionService from '../services/subscriptionServices.js';
import successResponse from '../utils/successResponse.js';

class SubscriptionController {
  async createSubscription(req, res, next) {
    try {
      const subscriptionData = req.body;
      const subscription = await subscriptionService.createSubscription(
        subscriptionData
      );
      successResponse(res, messages.SUBSCRIPTION_CREATED, subscription);
    } catch (error) {
      next(error);
    }
  }

  async getSubscriptions(req, res, next) {
    try {
      const subscriptions = await subscriptionService.getSubscriptions();
      successResponse(res, messages.GET_ALL_SUBSCRIPTIONS, subscriptions);
    } catch (error) {
      next(error);
    }
  }

  async getSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.getSubscription(
        req.params.id
      );
      successResponse(res, messages.GET_SINGLE_SUBSCRIPTION, subscription);
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.updateSubscription(
        req.params.id,
        req.body
      );
      successResponse(res, messages.SUBSCRIPTION_UPDATED, subscription);
    } catch (error) {
      next(error);
    }
  }

  async deleteSubscription(req, res) {
    try {
      await this.subscriptionService.deleteSubscription(req.params.id);
      successResponse(res, messages.SUBSCRIPTION_DELETED, {});
    } catch (error) {
      next(error);
    }
  }

  //  --------------------- user side subscription ---------------------

  async purchaseSubscription(req, res, next) {
    try {
      const subscriptionData = req.body;
      subscriptionData.userId = req.user.id;
      const subscription = await subscriptionService.purchaseSubscription(
        subscriptionData
      );
      successResponse(res, messages.SUBSCRIPTION_CREATED, subscription);
    } catch (error) {
      next(error);
    }
  }

  async getUserSubscriptions(req, res, next) {
    try {
      const subscriptions = await subscriptionService.getUserSubscriptions(
        req.user.id
      );
      successResponse(res, messages.GET_ALL_SUBSCRIPTIONS, subscriptions);
    } catch (error) {
      next(error);
    }
  }

  async getUserActiveSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.getActiveSubscription(
        req.user.id
      );
      successResponse(res, messages.GET_SINGLE_SUBSCRIPTION, subscription);
    } catch (error) {
      next(error);
    }
  }
}

const subscriptionController = new SubscriptionController();
export default subscriptionController;
