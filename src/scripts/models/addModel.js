import { addStory, addStoryGuest } from "../api/story.js";

class AddModel {
  getToken() {
    return localStorage.getItem('token');
  }

  submitStory(formData) {
    const token = this.getToken();
    return token ? addStory(formData, token) : addStoryGuest(formData);
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
