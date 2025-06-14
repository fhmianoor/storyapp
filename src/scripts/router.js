import SaveDataPresenter from './presenters/savePresenter.js';
import SaveView from './views/saveView.js'; 
import SaveModel from './models/saveModel.js';

import LoginView from './views/LoginView.js';
import LoginModel from './models/LoginModel.js';
import LoginPresenter from './presenters/loginPresenter.js';

import RegisterView from './views/RegisterView.js';
import RegisterModel from './models/registerModel.js';
import RegisterPresenter from './presenters/registerPresenter.js';

import AddView from './views/addstoryView.js';
import AddModel from './models/addModel.js';
import AddPresenter from './presenters/addStoryPresenter.js';

import HomeView from './views/HomeView.js';
import HomeModel from './models/homeModel.js';
import HomePresenter from './presenters/homePresenter.js';

import DetailStoryView from './views/DetailstoryView.js';
import DetailStoryModel from './models/detailModel.js';
import DetailStoryPresenter from './presenters/detailstoryPresenter.js';

import SubscribeView from './views/pushView.js';
import SubscribeModel from './models/pushModel.js';
import SubscribePresenter from './presenters/pushPresenter.js';
import AuthModel from './models/authModel.js';

const routes = {
  '/': () => new HomePresenter(new HomeView(), new HomeModel()),
  '/login': () => new LoginPresenter(new LoginView(), new LoginModel()),
  '/add': () => new AddPresenter(new AddView(), new AddModel()),
  '/register': () => new RegisterPresenter(new RegisterView(), new RegisterModel()),
  '/subscribe': () => new SubscribePresenter(
  new SubscribeView(),
  SubscribeModel,
  AuthModel
),
  '/detail/:id': (params) => new DetailStoryPresenter(new DetailStoryView(), new DetailStoryModel(), params),
 '/saved': () => new SaveDataPresenter(new SaveView(), new SaveModel()),
};

function parseUrl() {
  const hash = window.location.hash.slice(1).toLowerCase() || '/';
  const url = hash.split('/');
  return {
    resource: url[1] || null,
    id: url[2] || null,
    path: `/${url[1] || ''}${url[2] ? '/:id' : ''}`,
  };
}

// Fallback fade transition jika browser belum support View Transitions API
async function fadeTransition(element, content) {
  element.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 250));
  element.innerHTML = content;
  element.classList.remove('fade-out');
  element.classList.add('fade-in');
  setTimeout(() => element.classList.remove('fade-in'), 250);
}

// Wrapper transisi: pilih View Transitions API jika tersedia, jika tidak fallback
async function handleTransition(element, content) {
  if (!document.startViewTransition) {
    await fadeTransition(element, content);
    return;
  }

  element.style.viewTransitionName = 'page';
  const transition = document.startViewTransition(() => {
    element.innerHTML = content;
  });

  await transition.updateCallbackDone;
}

// Router utama
async function router() {
  const main = document.getElementById('main-content');
  if (!main) return;

  const { path, id } = parseUrl();
  const render = routes[path];

  if (!render) {
    return handleTransition(main, '<p>Halaman tidak ditemukan</p>');
  }

  const presenter = typeof render === 'function' ? render({ id }) : render;
  const viewHtml = await presenter.view.render();

  await handleTransition(main, viewHtml);
  presenter.afterRender();
}

// Event listener
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default router;
