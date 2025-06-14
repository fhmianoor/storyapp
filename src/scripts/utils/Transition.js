// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
  
  // Tangkap semua link internal (href mulai dengan / atau tanpa http)
  const internalLinks = Array.from(document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="#"]'))
    .filter(a => !a.href.startsWith('http') || a.origin === location.origin);
  
  internalLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');
      
      // Tunggu animasi selesai sebelum pindah
      setTimeout(() => {
        if (href.startsWith('#')) {
          // Scroll ke anchor tanpa reload halaman
          location.hash = href;
          document.body.classList.remove('fade-out');
          document.body.classList.add('fade-in');
        } else {
          window.location.href = href;
        }
      }, 400); 
    });
  });
});
