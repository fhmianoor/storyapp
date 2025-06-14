export default class RegisterView {
  render() {
    return `
      <main class="register-page">
        <form id="register-form">
          <input type="text" name="name" placeholder="Nama" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Daftar</button>
          <div id="register-error" style="color:red;"></div>
        </form>
      </main>
    `;
  }

  bindSubmit(handler) {
    document.getElementById('register-form').onsubmit = handler;
  }

  showError(message) {
    document.getElementById('register-error').textContent = message;
  }

  redirectToLogin() {
    window.location.hash = '#/login';
  }
}
