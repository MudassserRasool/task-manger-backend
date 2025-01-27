import profileService from '../services/profileService.js';
import successResponse from '../utils/successResponse.js';

// get the user profile with the id of the user
class ProfileController {
  async getCurrentProfileInfo(req, res, next) {
    const userId = req.user.id;
    try {
      const profile = await profileService.getCurrentProfileInfo(userId);
      successResponse(res, 'Profile fetched successfully', profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileInfo(req, res, next) {
    const userId = req.user.id;
    try {
      const profile = await profileService.getCurrentProfileInfo(userId);

      const tasks = [];

      if (req.body.experiences && req.body.experiences.length) {
        tasks.push(
          profileService.addExperience(profile.id, req.body.experiences)
        );
      }

      if (req.body.preferences && req.body.preferences.length) {
        tasks.push(profileService.addReference(userId, req.body.preferences));
      }

      delete req.body['experiences'];
      delete req.body['preferences'];
      tasks.push(profileService.updateUserProfile(userId, req.body));

      const [_, __, profileResult] = await Promise.all(tasks);

      successResponse(res, 'Profile updated successfully', profileResult);
    } catch (error) {
      next(error);
    }
  }
}

const profileController = new ProfileController();
export default profileController;
