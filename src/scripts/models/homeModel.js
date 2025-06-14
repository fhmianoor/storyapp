import { getStoriesWithAuth } from '../api/story.js';

class HomeModel {
  getToken() {
    return localStorage.getItem('token');
  }

  async getStories(token, params = { size: 1000 }) {
    if (!token) return { listStory: [] };
    return await getStoriesWithAuth(token, params);
  }
}

export default HomeModel; 