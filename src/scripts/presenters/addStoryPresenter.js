async function getLocationName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data.display_name || 'Lokasi tidak diketahui';
  } catch {
    return 'Lokasi tidak diketahui';
  }
}

export default class AddPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.photoDataUrl = null;
    this.currentMarker = null;
  }

  async afterRender() {
    let lat = -6.2;
    let lon = 106.8;

    const location = await this.model.getCurrentLocation();
    if (location) {
      lat = location.lat;
      lon = location.lon;
      this.view.setLatLon(lat, lon);
    }

    const popupText = await getLocationName(lat, lon);

    this.view.initMapView({
      lat,
      lon,
      popupText,
      getLocationName,
      setLatLon: this.view.setLatLon,
      setMapPopup: this.view.setMapPopup,
      setCurrentMarker: (marker) => {
        this.currentMarker = marker;
        window.currentAddMarker = marker;
      },
    });

    this.view.initCameraView({
      onPhotoCaptured: (dataUrl) => (this.photoDataUrl = dataUrl),
      showCameraUI: this.view.showCameraUI,
      showPhotoPreview: this.view.showPhotoPreview,
    });

    this.view.bindSubmit(this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { description, lat, lon } = e.target;

    if (!this.photoDataUrl) {
      return this.view.renderError('Ambil foto dengan kamera terlebih dahulu!');
    }

    const photo = this.dataURLtoFile(this.photoDataUrl, 'camera-photo.png');
    if (!description.value || !photo) {
      return this.view.renderError('Semua field wajib diisi!');
    }

    if (photo.size > 1024 * 1024) {
      return this.view.renderError('Ukuran foto tidak boleh lebih dari 1MB!');
    }

    const formData = new FormData();
    formData.append('description', description.value);
    formData.append('photo', photo);
    if (lat.value) formData.append('lat', lat.value);
    if (lon.value) formData.append('lon', lon.value);

    this.view.showLoading(true);

    try {
      const res = await this.model.submitStory(formData);
      console.log('RESPONSE DARI API:', res);
      this.view.showLoading(false);

      if (!res.error) {
        this.view.showAlert('Cerita berhasil ditambahkan!');
        this.view.redirectToHome();
      } else {
        this.view.renderError(res.message || 'Gagal menambah cerita');
      }
    } catch (err) {
      this.view.showLoading(false);
      console.error('ERROR SAAT SUBMIT:', err);
      this.view.renderError('Terjadi kesalahan server');
    }
  }

  destroy() {
    this.view.camera?.stopCamera();
  }

  dataURLtoFile(dataurl, filename) {
    const [header, base64] = dataurl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const bin = atob(base64);
    const arr = Uint8Array.from(bin, char => char.charCodeAt(0));
    return new File([arr], filename, { type: mime });
  }
}
