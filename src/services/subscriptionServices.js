import { prisma } from '../config/db.js';
import subscriptionValidator from '../utils/validators/subscriptionValidator.js';

class SubscriptionService {
  async createSubscription(subscription) {
    subscriptionValidator.validateSubscription(subscription);
    const data = await prisma.subscription.create({
      data: subscription,
    });
    return data;
  }

  async getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        price: 'asc',
      },
    });
    return subscriptions;
  }

  async getSubscription(id) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: Number(id),
      },
    });
    return subscription;
  }

  async updateSubscription(id, subscription) {
    subscriptionValidator.validateSubscription(subscription);
    const data = await prisma.subscription.update({
      where: {
        id: Number(id),
      },
      data: subscription,
    });
    return data;
  }

  async deleteSubscription(id) {
    const data = await prisma.subscription.delete({
      where: {
        id: Number(id),
      },
    });
    return data;
  }

  // --------------------- user side subscription ---------------------
  async purchaseSubscription(subscription) {
    subscriptionValidator.validateSubscription(subscription);
    const subscriptionData = await prisma.subscription.findUnique({
      where: {
        id: subscription.subscriptionId,
      },
    });
    const subscriptionDuration = subscriptionData.duration;
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: subscription,
      });

      subscription.purchaseDate = result.payment.createdAt;
      subscription.expiryDate = new Date(
        subscription.purchaseDate.getTime() +
          subscriptionDuration * 24 * 60 * 60 * 1000
      );
      subscription.status = 'active';
      const userSubscription = await tx.userSubscription.create({
        data: subscription,
      });

      return { payment, userSubscription };
    });

    return data;
  }

  // get all subscriptions purchased by user
  async getUserSubscriptions(userId) {
    const subscriptions = await prisma.userSubscription.findMany({
      where: {
        userId: Number(userId),
      },
    });
    return subscriptions;
  }

  // get active subscription purchased by user
  async getActiveSubscription(userId) {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: Number(userId),
        status: 'active',
      },
    });
    return subscription;
  }
}
const subscriptionService = new SubscriptionService();

export default subscriptionService;
