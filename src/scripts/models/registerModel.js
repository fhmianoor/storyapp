import { register } from '../api/story.js';

export default class RegisterModel {
  async registerUser({ name, email, password }) {
    return await register({ name, email, password });
  }
}