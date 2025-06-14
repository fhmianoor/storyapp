import HomeModel from "../models/homeModel";
import HomeView from "../views/HomeView"; 

export default class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    const token = this.model.getToken();
    if (!token) {
      this.view.renderStories([]);
      this.view.showAlert('Silakan login untuk melihat daftar cerita!');
      this.view.redirectToLogin();
      return;
    }
    this.view.showLoading(true);
    const data = await this.model.getStories(token, { size: 100 });
    this.view.renderStories(data.listStory || []);
    setTimeout(() => {
      this.view.renderMap(data.listStory || []);
    }, 0);
    this.view.bindAddStory(() => {
      this.view.redirectToAdd();
    });
    this.view.bindShowMore(() => {
      this.view.showMoreLoading(true);
      setTimeout(() => {
        this.view.renderStories(this.view.list, true);
        this.view.renderMap(this.view.list);
      }, 500);
    });
  }
} 