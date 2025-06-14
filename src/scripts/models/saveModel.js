import { getAllStories, deleteStory, getStoryById, updateStory, saveStory } from '../utils/idb.js';
import { getStories, getStoriesWithAuth } from '../api/story.js';

class SaveModel {
  constructor() {
    this._token = null;
    this._initToken();
  }

  _initToken() {
    try {
      this._token = localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      this._token = null;
    }
  }

  getToken() {
    return this._token;
  }

  async getAll() {
    try {
      // Jika online, ambil data dari API
      if (navigator.onLine) {
        const response = this._token ? await getStoriesWithAuth(this._token) : await getStories();
        
        if (!response.error && response.data) {
          try {
            // Simpan data dari API ke IndexedDB
            for (const story of response.data) {
              if (story && (story.id || story._id)) {
                await saveStory({
                  ...story,
                  id: story.id || story._id,
                  syncStatus: 'synced',
                  lastSynced: new Date().toISOString()
                });
              }
            }
          } catch (dbError) {
            console.error('Error saving to IndexedDB:', dbError);
            // Lanjutkan meskipun gagal menyimpan ke IndexedDB
          }
          return response.data;
        }
      }
      
      // Jika offline atau gagal mengambil dari API, ambil dari IndexedDB
      try {
        const stories = await getAllStories();
        return stories || [];
      } catch (dbError) {
        console.error('Error getting stories from IndexedDB:', dbError);
        return [];
      }
    } catch (error) {
      console.error('Error getting stories:', error);
      return [];
    }
  }

  async delete(id) {
    try {
      await deleteStory(id);
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      return false;
    }
  }

  async getById(id) {
    try {
      const story = await getStoryById(id);
      return story;
    } catch (error) {
      console.error('Error getting story by id:', error);
      return null;
    }
  }

  async update(id, storyData) {
    try {
      // Cek koneksi
      if (!navigator.onLine) {
        try {
          // Simpan ke IndexedDB untuk sync nanti
          await saveStory({
            ...storyData,
            id,
            syncStatus: 'pending',
            lastUpdated: new Date().toISOString()
          });
          return { success: true, offline: true };
        } catch (dbError) {
          console.error('Error saving to IndexedDB:', dbError);
          return { success: false, error: dbError };
        }
      }

      // Jika online, update langsung
      try {
        await updateStory(id, storyData);
        return { success: true, offline: false };
      } catch (updateError) {
        console.error('Error updating story:', updateError);
        return { success: false, error: updateError };
      }
    } catch (error) {
      console.error('Error in update operation:', error);
      return { success: false, error };
    }
  }

  // Method untuk sync data offline
  async syncOfflineData() {
    if (!navigator.onLine) return;

    try {
      const stories = await getAllStories();
      if (!stories) return;

      const pendingStories = stories.filter(story => story && story.syncStatus === 'pending');

      for (const story of pendingStories) {
        try {
          if (story && story.id) {
            await updateStory(story.id, story);
            // Update status sync
            await saveStory({
              ...story,
              syncStatus: 'synced',
              lastSynced: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error syncing story:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }
}

export default SaveModel;
