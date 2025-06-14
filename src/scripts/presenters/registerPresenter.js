export default class RegisterPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    this.view.bindSubmit(async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      try {
        const res = await this.model.registerUser({ name, email, password });
        if (res.error) {
          this.view.showError(res.message);
        } else {
          this.view.redirectToLogin();
        }
      } catch {
        this.view.showError('Gagal mendaftar. Coba lagi.');
      }
    });
  }
}