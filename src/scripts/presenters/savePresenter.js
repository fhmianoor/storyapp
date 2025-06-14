class SaveDataPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    await this.loadStories();

    // Event listener untuk status online/offline
    window.addEventListener('online', async () => {
      this.view.showAlert('Koneksi internet tersedia. Menyinkronkan data...');
      await this.model.syncOfflineData();
      await this.loadStories();
    });

    window.addEventListener('offline', () => {
      this.view.showAlert('Anda sedang offline. Perubahan akan disimpan secara lokal.');
    });

    window.addEventListener('delete-story', async (e) => {
      if (confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
        this.view.showLoading(true);
        try {
          await this.model.delete(e.detail.id);
          await this.loadStories();
          this.view.showAlert('Cerita berhasil dihapus!');
        } catch (error) {
          console.error('Error deleting story:', error);
          this.view.showAlert('Gagal menghapus cerita');
        } finally {
          this.view.showLoading(false);
        }
      }
    });

    window.addEventListener('edit-story', async (e) => {
      const story = await this.model.getById(e.detail.id);
      if (story) {
        // Redirect to edit page with story data
        window.location.hash = `#/edit/${story.id}`;
      }
    });
  }

  async loadStories() {
    this.view.showLoading(true);
    try {
      const stories = await this.model.getAll();
      this.view.showStories(stories);
      
      // Tampilkan status offline jika ada
      if (!navigator.onLine) {
        const pendingStories = stories.filter(story => story.syncStatus === 'pending');
        if (pendingStories.length > 0) {
          this.view.showAlert(`${pendingStories.length} cerita menunggu untuk disinkronkan`);
        }
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      this.view.showAlert('Gagal memuat data cerita');
    } finally {
      this.view.showLoading(false);
    }
  }
}

export default SaveDataPresenter;
