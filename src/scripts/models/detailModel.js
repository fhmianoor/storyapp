import { getStoryDetail } from '../api/story.js';

export default class DetailStoryModel {
  async fetchStory(id) {
    const token = localStorage.getItem('token');
    return await getStoryDetail(id, token);
  }
}