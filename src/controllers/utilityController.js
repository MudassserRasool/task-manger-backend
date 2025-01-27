import { BACKEND_BASE_URL } from '../constants/index.js';

class UtilityController {
  async uploadImage(req, res) {
    if (!req.file?.filename) {
      return res.status(400).json({
        success: false,
        message: "Request doesn't have file.",
      });
    }
    return res.status(200).json({
      success: true,
      message: 'success',
      data: {
        url: `${BACKEND_BASE_URL}/${req.file?.filename}`,
      },
    });
  }
}

export default new UtilityController();
