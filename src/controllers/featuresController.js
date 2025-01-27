import featureService from '../services/featureServices.js';
import successResponse from '../utils/successResponse.js';

class FeatureController {
  async createFeature(req, res, next) {
    try {
      const feature = req.body;
      const data = await featureService.createFeature(feature);
      successResponse(res, 'Feature created successfully', data, 201);
    } catch (error) {
      next(error);
    }
  }

  async getFeatures(req, res, next) {
    try {
      const features = await featureService.getFeatures();
      successResponse(res, 'Features retrieved successfully', features);
    } catch (error) {
      next(error);
    }
  }

  async getFeature(req, res, next) {
    try {
      const { id } = req.params;
      const feature = await featureService.getFeature(id);
      successResponse(res, 'Feature retrieved successfully', feature);
    } catch (error) {
      next(error);
    }
  }

  async updateFeature(req, res, next) {
    try {
      const { id } = req.params;
      const feature = req.body;
      const data = await featureService.updateFeature(id, feature);
      successResponse(res, 'Feature updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteFeature(req, res, next) {
    try {
      const { id } = req.params;
      const data = await featureService.deleteFeature(id);
      successResponse(res, 'Feature deleted successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

const featureController = new FeatureController();
export default featureController;
