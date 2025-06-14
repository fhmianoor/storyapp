import './router.js';
import '../styles/main.css';
import './utils/Transition.js';
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
