import {initMap} from "../utils/map.js";
import {Camera} from "../utils/Camera.js";

export default class AddView {
  async render() {
    return `
      <main id="main-content" class="main-content add-page" tabindex="-1">
        <section class="add-section">
          <div class="add-card">
            <h1><i class='fa-solid fa-plus' style='color:#6C63FF;margin-right:8px;'></i>Tambah Cerita</h1>
            <form id="add-form">
              <label for="description"><i class='fa-solid fa-align-left' style='margin-right:6px;'></i>Deskripsi</label>
              <textarea id="description" name="description" required aria-required="true" rows="3" style="resize:vertical;width:100%;max-width:400px;"></textarea>
              <div style="margin:8px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <button type="button" id="open-camera-btn"><i class='fa-solid fa-camera' style='margin-right:6px;'></i>Buka Kamera</button>
                <video id="video" width="320" height="240" autoplay playsinline style="display:none;border-radius:8px;"></video>
                <button type="button" id="capture-btn" style="display:none;"><i class='fa-solid fa-circle-dot' style='margin-right:6px;'></i>Ambil Foto</button>
                <img id="photo-preview" alt="Preview Foto hasil kamera" style="display:none;width:120px;margin-top:8px;border-radius:8px;object-fit:cover;box-shadow:0 2px 8px #5BC0EB22;" />
                <button type="button" id="close-camera-btn" style="display:none;"><i class='fa-solid fa-xmark' style='margin-right:6px;'></i>Tutup Kamera</button>
              </div>
              <label for="lat"><i class='fa-solid fa-location-dot' style='margin-right:6px;'></i>Latitude</label>
              <input id="lat" name="lat" required readonly aria-required="true" />
              <label for="lon"><i class='fa-solid fa-location-dot' style='margin-right:6px;'></i>Longitude</label>
              <input id="lon" name="lon" required readonly aria-required="true" />
              <div id="map" style="height:300px;background:#eee;">[Peta akan tampil di sini]</div>
              <button type="submit"><i class='fa-solid fa-save' style='margin-right:6px;'></i>Simpan</button>
              <div id="add-loading" class="loading" style="display:none;text-align:center;margin:16px 0;">
                <span class="loading-spinner"></span> Menyimpan data...
              </div>
              <div id="add-error" style="color:red;margin-top:8px;"></div>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  bindSubmit(handler) {
    document.getElementById('add-form').onsubmit = handler;
  }

  bindCameraEvents({ onOpen, onCapture, onClose }) {
    document.getElementById('open-camera-btn').onclick = onOpen;
    document.getElementById('capture-btn').onclick = onCapture;
    document.getElementById('close-camera-btn').onclick = onClose;
  }

  showCameraUI(show) {
    document.getElementById('video').style.display = show ? '' : 'none';
    document.getElementById('capture-btn').style.display = show ? '' : 'none';
    document.getElementById('close-camera-btn').style.display = show ? '' : 'none';
  }

  showPhotoPreview(dataUrl) {
    const img = document.getElementById('photo-preview');
    if (dataUrl) {
      img.src = dataUrl;
      img.style.display = '';
    } else {
      img.src = '';
      img.style.display = 'none';
    }
  }

  renderError(msg) {
    document.getElementById('add-error').textContent = msg;
  }

  showLoading(isLoading) {
    const loading = document.getElementById('add-loading');
    if (loading) loading.style.display = isLoading ? '' : 'none';
  }

  setLatLon(lat, lon) {
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
  }

  showAlert(message) {
    alert(message);
  }

  redirectToHome() {
    window.location.hash = '#/';
  }

  setMapPopup(name) {
    if (window.currentAddMarker) {
      window.currentAddMarker.bindPopup(name).openPopup();
    }
  }

  initMapView({ lat, lon, popupText, getLocationName, setLatLon, setMapPopup, setCurrentMarker }) {
    this.mapInstance = initMap({
      id: 'map',
      lat,
      lon,
      zoom: 13,
      onClick: async (latlng) => {
        setLatLon(latlng.lat, latlng.lng);
        const name = await getLocationName(latlng.lat, latlng.lng);
        setMapPopup(name);
      },
      marker: true,
      popupText,
      onMarkerUpdate: (marker) => {
        setCurrentMarker(marker);
      },
    });
  }

  initCameraView({ onPhotoCaptured, showCameraUI, showPhotoPreview }) {
    const video = document.getElementById('video');
    this.camera = new Camera(video);
    this.photoDataUrl = null;
    this.bindCameraEvents({
      onOpen: async () => {
        await this.camera.startCamera();
        showCameraUI(true);
      },
      onCapture: () => {
        this.photoDataUrl = this.camera.capturePhoto();
        showPhotoPreview(this.photoDataUrl);
        this.camera.stopCamera();
        showCameraUI(false);
        if (onPhotoCaptured) onPhotoCaptured(this.photoDataUrl);
      },
      onClose: () => {
        this.camera.stopCamera();
        showCameraUI(false);
      }
    });
  }
} 