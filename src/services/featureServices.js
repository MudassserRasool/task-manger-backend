import { prisma } from '../config/db.js';
import ExceptionHandler from '../utils/error.js';

class FeatureServices {
  async createFeature(feature) {
    const existingFeature = await prisma.feature.findUnique({
      where: {
        title: feature.title,
      },
    });
    if (existingFeature) {
      throw new Error('Feature with this title already exists');
    }
    const data = await prisma.feature.create({
      data: feature,
    });
    return data;
  }
  async getFeatures() {
    const features = await prisma.feature.findMany();
    return features;
  }
  async getFeature(id) {
    const feature = await prisma.feature.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!feature) {
      ExceptionHandler.NotFound('Feature not found');
    }
    return feature;
  }
  async updateFeature(id, feature) {
    const featureId = Number(id);
    const singleFeature = await prisma.feature.findUnique({
      where: {
        id: featureId,
      },
    });
    if (!singleFeature) {
      throw new Error('Feature not found');
    }
    const data = await prisma.feature.update({
      where: {
        id: featureId,
      },
      data: feature,
    });
    return data;
  }
  async deleteFeature(id) {
    const singleFeature = await prisma.feature.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!singleFeature) {
      throw new Error('Feature not found');
    }
    const data = await prisma.feature.delete({
      where: {
        id: Number(id),
      },
    });
    return data;
  }
}

const featureService = new FeatureServices();
export default featureService;
