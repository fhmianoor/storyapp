export default class DetailStoryView {
  render(detail) {
    return `
      <main>
        <h1>Detail Cerita</h1>
        <img src="${detail.photoUrl}" alt="${detail.description}" />
        <p>${detail.description}</p>
        <p>Latitude: ${detail.lat}</p>
        <p>Longitude: ${detail.lon}</p>
      </main>
    `;
  }
}