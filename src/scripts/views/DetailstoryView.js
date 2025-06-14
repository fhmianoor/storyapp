import { saveStory, getStoryById, deleteStory } from '../utils/idb.js';

export default class DetailStoryView {
  async render() {
    return `
      <main id=\"main-content\" tabindex=\"-1\">\n        
        <h1><i class=\"fa-solid fa-circle-info\" style=\"color:#6C63FF;margin-right:8px;\"></i>Detail Cerita</h1>\n        
        <div id=\"detail-container\"></div>\n      
        <div id=\"save-actions-container\"></div>\n    </main>\n    `;
  }

  async renderDetail(story) {
    const container = document.getElementById('detail-container');
    if (!story) {
      container.innerHTML = '<p>Story tidak ditemukan.</p>';
      return;
    }
    this._currentStory = story;
    container.innerHTML = `
      <div class=\"story-detail\">
        <img src=\"${story.photoUrl}\" alt=\"${story.description || 'Foto cerita'}\" style=\"width:100%;max-width:400px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px #5BC0EB22;\" onerror=\"this.onerror=null;this.src='images/fallback.png';\" />
        <h2><i class=\"fa-solid fa-user\" style=\"color:#5BC0EB;margin-right:6px;\"></i>${story.name}</h2>
        <p>${story.description}</p>
        <p><i class=\"fa-solid fa-location-dot\" style=\"color:#FFD803;margin-right:4px;\"></i>Lat: ${story.lat}, Lng: ${story.lon}</p>
        <p><i class=\"fa-solid fa-calendar-days\" style=\"color:#6C63FF;margin-right:4px;\"></i>Dibuat: ${story.createdAt}</p>
      </div>
    `;
    await this.renderSaveButton();
  }

  async renderSaveButton() {
    const isSaved = await getStoryById(this._currentStory.id);
    const container = document.getElementById('save-actions-container');
    container.className = 'center-btn-container';
    if (isSaved) {
      container.innerHTML = `
        <button id=\"report-detail-delete\" class=\"delete-btn\"><i class=\"fa-solid fa-trash\"></i> Hapus Cerita</button>
      `;
      document.getElementById('report-detail-delete').addEventListener('click', async () => {
        await deleteStory(this._currentStory.id);
        alert('Cerita berhasil dihapus dari perangkat!');
        await this.renderSaveButton();
      });
    } else {
      container.innerHTML = `
        <button id=\"report-detail-save\" class=\"save-btn\"><i class=\"fa-solid fa-floppy-disk\"></i> Simpan Cerita</button>
      `;
      document.getElementById('report-detail-save').addEventListener('click', async () => {
        await saveStory(this._currentStory);
        alert('Cerita berhasil disimpan ke perangkat!');
        await this.renderSaveButton();
      });
    }
  }
} 