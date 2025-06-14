export default class LoginView {
  async render() {
    return `
      <section class="auth-section">
        <div class="auth-card">
          <h1><i class='fa-solid fa-right-to-bracket' style='color:#6C63FF;margin-right:8px;'></i>Login</h1>
          <form id="login-form">
            <label for="email"><i class='fa-solid fa-envelope' style='margin-right:6px;'></i>Email</label>
            <input id="email" name="email" type="email" required />
            <label for="password"><i class='fa-solid fa-lock' style='margin-right:6px;'></i>Password</label>
            <input id="password" name="password" type="password" required minlength="8" />
            <button type="submit"><i class='fa-solid fa-arrow-right-to-bracket' style='margin-right:6px;'></i>Login</button>
          </form>
          <div id="login-error" style="color:red;margin-top:8px;"></div>
          <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </div>
      </section>
    `;
  }

  bindSubmit(handler) {
    document.getElementById('login-form').onsubmit = handler;
  }

  renderError(msg) {
    document.getElementById('login-error').textContent = msg;
  }

  showAlert(message) {
    alert(message);
  }

  redirectToHome() {
    window.location.hash = '#/';
  }
} 