import { prisma } from '../config/db.js';
import ExceptionHandler from '../utils/error.js';
import { isValidSeqId } from '../utils/validators/index.js';

class ProfileService {
  async getCurrentProfileInfo(id) {
    const userId = Number(id);
    try {
      const profile = await prisma.profile.findUnique({
        where: {
          userId,
        },
        include: {
          experiences: true,
          references: true,
        },
      });
      if (!profile) {
        ExceptionHandler.NotFoundError('Profile not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(id, data) {
    console.log(
      '-------------------------------user profile data --------------'
    );
    console.log(data);

    console.log(
      '-------------------------------user profile data --------------'
    );

    const userId = Number(id);
    try {
      const profile = await prisma.profile.findUnique({
        where: {
          userId,
        },
      });
      if (!profile) {
        ExceptionHandler.NotFoundError('Profile not found');
      }
      const updatedProfile = await prisma.profile.update({
        where: {
          userId,
        },
        data: {
          ...data,
        },
        include: {
          experiences: true,
          references: true,
        },
      });
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  async addExperience(id, data) {
    const profileId = Number(id);

    try {
      if (!isValidSeqId(profileId)) {
        ExceptionHandler.BadRequest('Invalid profile id');
      }

      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
      });

      if (!profile) {
        throw ExceptionHandler.BadRequest(
          'Profile not found, please create a profile first'
        );
      }

      const existingExperiences = await prisma.experience.findMany({
        where: { profileId },
      });

      const experiencesToUpdate = [];
      const experiencesToCreate = [];
      const dataJobTitlesAndCompanies = new Set(
        data.map((item) => `${item.jobTitle}-${item.companyName}`)
      );

      for (const item of data) {
        const existing = existingExperiences.find(
          (exp) =>
            exp.jobTitle === item.jobTitle &&
            exp.companyName === item.companyName
        );

        if (existing) {
          experiencesToUpdate.push({
            id: existing.id,
            ...item,
          });
        } else {
          experiencesToCreate.push(item);
        }
      }

      const experiencesToRemove = existingExperiences.filter(
        (exp) =>
          !dataJobTitlesAndCompanies.has(`${exp.jobTitle}-${exp.companyName}`)
      );

      // Update existing experiences
      await Promise.all(
        experiencesToUpdate.map((exp) =>
          prisma.experience.update({
            where: { id: exp.id },
            data: exp,
          })
        )
      );

      // Create new experiences
      if (experiencesToCreate.length > 0) {
        await prisma.experience.createMany({
          data: experiencesToCreate.map((item) => ({
            ...item,
            profileId,
          })),
        });
      }

      // Remove experiences not in the new data
      if (experiencesToRemove.length > 0) {
        await prisma.experience.deleteMany({
          where: {
            id: { in: experiencesToRemove.map((exp) => exp.id) },
          },
        });
      }

      const allExperiences = await prisma.experience.findMany({
        where: { profileId },
      });

      return allExperiences.map((exp) => exp.id);
    } catch (error) {
      throw error;
    }
  }

  async updateExperience(profileId, data) {
    const experienceId = Number(data.id);
    try {
      const experience = await prisma.experience.findUnique({
        where: {
          id: experienceId,
        },
      });
      if (!experience) {
        ExceptionHandler.NotFoundError('Experience not found');
      }
      const updatedExperience = await prisma.experience.updateMany({
        where: {
          id: experienceId,
        },
        data: {
          ...data,
        },
      });
      return updatedExperience;
    } catch (error) {
      throw error;
    }
  }

  async addReference(id, data) {
    const userId = Number(id);

    try {
      const profile = await prisma.profile.findUnique({
        where: {
          userId,
        },
      });

      if (!profile) {
        ExceptionHandler.NotFoundError('Profile not found');
      }

      const existingReferences = await prisma.reference.findMany({
        where: { profileId: profile.id },
      });

      const referencesToUpdate = [];
      const referencesToCreate = [];
      const dataEmails = new Set(data.map((item) => item.email));

      for (const item of data) {
        const existing = existingReferences.find(
          (ref) => ref.email === item.email
        );

        if (existing) {
          referencesToUpdate.push({
            id: existing.id,
            ...item,
          });
        } else {
          referencesToCreate.push(item);
        }
      }

      const referencesToRemove = existingReferences.filter(
        (ref) => !dataEmails.has(ref.email)
      );

      // Update existing references
      await Promise.all(
        referencesToUpdate.map((ref) =>
          prisma.reference.update({
            where: { id: ref.id },
            data: ref,
          })
        )
      );

      // Create new references
      if (referencesToCreate.length > 0) {
        await prisma.reference.createMany({
          data: referencesToCreate.map((item) => ({
            ...item,
            profileId: profile.id,
          })),
        });
      }

      // Remove references not in the new data
      if (referencesToRemove.length > 0) {
        await prisma.reference.deleteMany({
          where: {
            id: { in: referencesToRemove.map((ref) => ref.id) },
          },
        });
      }

      const allReferences = await prisma.reference.findMany({
        where: { profileId: profile.id },
      });

      return allReferences.map((ref) => ref.id);
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService();
