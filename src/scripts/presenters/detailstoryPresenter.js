import DetailModel from "../models/detailModel.js";
import { parseActivePathname } from "../utils/url-parser.js";

export default class DetailStoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    const story = await this.model.getDetail(id);
    this.view.renderDetail(story);
  }
} 