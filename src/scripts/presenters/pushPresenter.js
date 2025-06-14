export default class SubscribePresenter {
  constructor(view, model, authModel) {
    this.view = view;
    this.model = model;
    this.authModel = authModel;
  }

  async afterRender() {
    this.view.bindActions({
      Subscribe: async () => {
        try {
          const token = this.authModel.getToken();
          if (!token) throw new Error('Token tidak ditemukan');
          const subscription = await this.subscribeToPush();
          const res = await this.model.subscribeUser(token, subscription);
          this.view.showMessage(res.message || 'Berhasil berlangganan!');
        } catch (err) {
          this.view.showMessage(err.message || 'Gagal berlangganan');
        }
      },

      Unsubscribe: async () => {
        try {
          const token = this.authModel.getToken();
          if (!token) throw new Error('Token tidak ditemukan');
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          if (!sub) throw new Error('Kamu belum berlangganan');
          const res = await this.model.unsubscribeUser(token, sub.endpoint);
          await sub.unsubscribe();
          this.view.showMessage(res.message || 'Berhasil berhenti langganan!');
        } catch (err) {
          this.view.showMessage(err.message || 'Gagal berhenti langganan');
        }
      }
    });
  }

  async subscribeToPush() {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
      ),
    });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
  }
}

