import { addStory, addStoryGuest } from "../api/story.js";
import { saveStory } from "../utils/idb.js";

class AddModel {
  getToken() {
    return localStorage.getItem('token');
  }

  async submitStory(formData) {
    const token = this.getToken();
    const response = token ? await addStory(formData, token) : await addStoryGuest(formData);
    
    if (!response.error && response.data) {
      // Pastikan data memiliki id sebelum disimpan ke IndexedDB
      const storyData = {
        id: response.data.id || response.data._id, // Coba ambil id atau _id
        ...response.data,
        syncStatus: 'synced',
        lastSynced: new Date().toISOString()
      };
      
      try {
        await saveStory(storyData);
      } catch (error) {
        console.error('Error saving to IndexedDB:', error);
        // Lanjutkan meskipun gagal menyimpan ke IndexedDB
      }
    }
    
    return response;
  }

  async getCurrentLocation() {
    if (!navigator.geolocation) return null;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }
}

export default AddModel;
