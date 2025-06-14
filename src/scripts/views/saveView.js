class SaveView {
  constructor() {
    this.gridId = 'savedata-grid';
  }

  render() {
    return `
      <main id="main-content" tabindex="-1">
        <h1 class="home-title">
          <i class="fa-solid fa-floppy-disk" style="color:#FFD803;margin-right:8px;"></i>
          Data Cerita Tersimpan
        </h1>
        <div id="offline-indicator" style="display:none;background:#ffd803;color:#000;padding:8px;text-align:center;margin-bottom:16px;">
          <i class="fa-solid fa-wifi-slash"></i> Anda sedang offline
        </div>
        <section id="savedata-section">
          <div id="savedata-loading" class="loading" style="display:none;text-align:center;margin:32px 0;">
            <span class="loading-spinner"></span> Memuat data...
          </div>
          <section id="savedata-grid" class="story-grid" aria-label="Daftar Cerita Tersimpan"></section>
        </section>
      </main>
    `;
  }

  showStories(stories) {
    const grid = document.getElementById(this.gridId);
    grid.innerHTML = '';

    if (!stories.length) {
      grid.innerHTML = '<div style="text-align:center;color:#888;">Tidak ada data tersimpan.</div>';
      return;
    }

    const maxDesc = 120;
    const items = stories.map(story => {
      let desc = story.description || story.content || '';
      if (desc.length > maxDesc) desc = desc.slice(0, maxDesc) + '...';

      const offlineBadge = story.syncStatus === 'pending' 
        ? '<span class="offline-badge" style="background:#ffd803;color:#000;padding:2px 6px;border-radius:4px;font-size:12px;margin-left:8px;">Offline</span>' 
        : '';

      return `
        <article class="story-card" data-id="${story.id}">
          ${story.photoUrl ? `<img src="${story.photoUrl}" alt="Foto cerita" loading="lazy" />` : ''}
          <h2>${story.name || story.title || '-'} ${offlineBadge}</h2>
          <p>${desc}</p>
          ${story.lat && story.lon ? `<p>Lat: ${story.lat}, Lng: ${story.lon}</p>` : ''}
          <div class="story-actions">
            <button data-id="${story.id}" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button data-id="${story.id}" class="delete-btn"><i class="fa-solid fa-trash"></i> Hapus</button>
          </div>
        </article>
      `;
    }).join('');

    grid.innerHTML = items;

    // Pasang listener tombol hapus
    grid.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const deleteEvent = new CustomEvent('delete-story', { detail: { id } });
        window.dispatchEvent(deleteEvent);
      });
    });

    // Pasang listener tombol edit
    grid.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const editEvent = new CustomEvent('edit-story', { detail: { id } });
        window.dispatchEvent(editEvent);
      });
    });
  }

  showLoading(isLoading) {
    const loading = document.getElementById('savedata-loading');
    if (loading) loading.style.display = isLoading ? '' : 'none';
  }

  showAlert(message) {
    alert(message);
  }

  updateOfflineStatus(isOffline) {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = isOffline ? '' : 'none';
    }
  }
}

export default SaveView;
