import { getUrl, uploadData, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateUniqueId } from '@/services/utils';

export const storageApi = {
  async uploadAssetImage(file: File): Promise<{ key: string }> {
    try {
      const session = await fetchAuthSession();
      const identityId = session.identityId;

      if (!identityId) {
        throw new Error('No identity ID found in session');
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueFileName = `${Date.now()}-${generateUniqueId().substring(0, 8)}.${ext}`;
      const s3Path = `assets/${identityId}/${uniqueFileName}`;

      await uploadData({
        path: s3Path,
        data: file,
        options: {
          contentType: file.type || 'image/jpeg',
        },
      }).result;

      return { key: s3Path };
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error('Could not upload file', { cause: error });
    }
  },

  async uploadProfileImage(file: File): Promise<{ key: string }> {
    try {
      const session = await fetchAuthSession();
      const identityId = session.identityId;

      if (!identityId) {
        throw new Error('No identity ID found in session');
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueFileName = `${Date.now()}-${generateUniqueId().substring(0, 8)}.${ext}`;
      const s3Path = `profile-pictures/${identityId}/${uniqueFileName}`;

      await uploadData({
        path: s3Path,
        data: file,
        options: {
          contentType: file.type || 'image/jpeg',
        },
      }).result;

      return { key: s3Path };
    } catch (error) {
      console.error('Profile Image Upload Error:', error);
      throw new Error('Could not upload profile picture', { cause: error });
    }
  },

  async getSignedImageUrl(key: string): Promise<string> {
    try {
      const result = await getUrl({
        path: key,
        options: {
          validateObjectExistence: false,
          expiresIn: 900,
        },
      });
      return result.url.toString();
    } catch (error) {
      console.error('Get Signed URL Error:', error);
      throw new Error('Could not retrieve image', { cause: error });
    }
  },

  async removeAssetImage(key: string): Promise<void> {
    try {
      await remove({ path: key });
    } catch (error) {
      console.error('Delete S3 File Error:', error);
      throw new Error('Failed to delete old image from storage', { cause: error });
    }
  },
};
