import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const STORE_NAME = 'stories';

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveStory(story) {
  if (!story || !story.id) {
    console.warn('Gagal menyimpan story: id tidak valid', story);
    return;
  }

  try {
    return (await dbPromise).put(STORE_NAME, story);
  } catch (err) {
    console.error('Gagal menyimpan story ke IndexedDB:', err);
    throw err;
  }
}

export async function getAllStories() {
  return (await dbPromise).getAll(STORE_NAME);
}

export async function deleteStory(id) {
  if (!id) return;
  return (await dbPromise).delete(STORE_NAME, id);
}

export async function getStoryById(id) {
  if (!id) return null;
  return (await dbPromise).get(STORE_NAME, id);
}

export async function updateStory(id, storyData) {
  const db = await dbPromise;
  const existing = await db.get(STORE_NAME, id);
  
  if (!existing) {
    console.warn('Tidak ditemukan story saat update dengan ID:', id);
    throw new Error('Story not found');
  }

  const updatedStory = {
    ...existing,
    ...storyData,
    id: id,
    updatedAt: new Date().toISOString()
  };

  return db.put(STORE_NAME, updatedStory);
}
