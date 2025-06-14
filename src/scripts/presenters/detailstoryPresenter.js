export default class DetailStoryPresenter {
  constructor(view, model, params) {
    this.view = view;
    this.model = model;
    this.params = params;
  }

  async afterRender() {
    const detail = await this.model.fetchStory(this.params.id);
    document.getElementById('main-content').innerHTML = this.view.render(detail);
  }
}
