import config from "../config.js";

const path = {
  Register: `${config.BASE_URL}/register`,
  Login: `${config.BASE_URL}/login`,
  Stories: `${config.BASE_URL}/stories`,
  StoriesDetail: `${config.BASE_URL}/stories/guest`,
  Notification: `${config.BASE_URL}/notifications/subscribe`,
};

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  return res.json();
}

export const register = (payload) =>
  fetchJson(path.Register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

export const login = (payload) =>
  fetchJson(path.Login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

export const getStories = () => fetchJson(path.Stories);

export const getStoriesWithAuth = (token, params = {}) => {
  const url = new URL(path.Stories);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  return fetchJson(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStoryDetail = (id, token) =>
  fetchJson(`${path.Stories}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addStory = (formData, token) =>
  fetchJson(path.Stories, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

export const addStoryGuest = (formData) =>
  fetchJson(path.StoriesDetail, {
    method: 'POST',
    body: formData,
  });

export async function subscribeNotification(token, subscription) {
  const res = await fetch(path.Notification, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  return res.json();
}

export async function unsubscribeNotification(token, endpoint) {
  const res = await fetch(path.Notification, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint }),
  });
  return res.json();
}
