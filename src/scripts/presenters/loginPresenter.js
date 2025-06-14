export default class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    this.view.bindSubmit(async (e) => {
      e.preventDefault();

      const { email, password } = e.target;

      if (!email.value || !password.value) {
        this.view.renderError('Email dan password wajib diisi!');
        return;
      }

      try {
        const res = await this.model.loginUser({ email: email.value, password: password.value });

        if (res?.loginResult?.token) {
          this.model.saveToken(res.loginResult.token);
          this.view.showAlert('Login berhasil!');
          this.view.redirectToHome();
        } else {
          this.view.renderError(res.message || 'Login gagal');
        }
      } catch (err) {
        this.view.renderError('Terjadi kesalahan saat login');
        console.error('Login Error:', err);
      }
    });
  }
}
