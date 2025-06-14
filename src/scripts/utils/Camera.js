export class Camera {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.stream = null;
  }

  async startCamera(constraints = { video: { facingMode: 'environment' } }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API tidak didukung browser ini');
    }
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.videoElement.srcObject = this.stream;
    await this.videoElement.play();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.stream = null;
    }
  }

  capturePhoto() {
    if (!this.videoElement) return null;
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
} 