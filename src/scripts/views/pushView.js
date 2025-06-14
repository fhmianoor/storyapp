export default class SubscribeView {
  render() {
    return `
      <main>
        <button id="subscribe-btn">Subscribe</button>
        <button id="unsubscribe-btn">Unsubscribe</button>
        <div id="sub-msg"></div>
      </main>
    `;
  }

  bindActions({ Subscribe, Unsubscribe }) {
    document.getElementById('subscribe-btn')?.addEventListener('click', Subscribe);
    document.getElementById('unsubscribe-btn')?.addEventListener('click', Unsubscribe);
  }

  showMessage(msg) {
    const msgDiv = document.getElementById('sub-msg');
    if (msgDiv) msgDiv.textContent = msg;
  }
}
