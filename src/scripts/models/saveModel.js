import { getAllStories, deleteStory, getStoryById, updateStory, saveStory } from '../utils/idb.js';

class SaveModel {
  async getAll() {
    try {
      const stories = await getAllStories();
      return stories;
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
      throw error;
    }
  }

  async getById(id) {
    try {
      const story = await getStoryById(id);
      return story;
    } catch (error) {
      console.error('Error getting story by id:', error);
      throw error;
    }
  }

  async update(id, storyData) {
    try {
      // Cek koneksi
      if (!navigator.onLine) {
        // Simpan ke IndexedDB untuk sync nanti
        await saveStory({
          ...storyData,
          id,
          syncStatus: 'pending',
          lastUpdated: new Date().toISOString()
        });
        return { success: true, offline: true };
      }

      // Jika online, update langsung
      await updateStory(id, storyData);
      return { success: true, offline: false };
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  // Method untuk sync data offline
  async syncOfflineData() {
    if (!navigator.onLine) return;

    try {
      const stories = await getAllStories();
      const pendingStories = stories.filter(story => story.syncStatus === 'pending');

      for (const story of pendingStories) {
        try {
          await updateStory(story.id, story);
          // Update status sync
          await saveStory({
            ...story,
            syncStatus: 'synced',
            lastSynced: new Date().toISOString()
          });
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
