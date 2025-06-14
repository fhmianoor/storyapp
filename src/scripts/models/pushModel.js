import { subscribeNotification, unsubscribeNotification } from '../api/story.js';
import './authModel.js';
export default {
  async subscribeUser(token, subscription) {
    const { endpoint, keys } = subscription.toJSON();

    const payload = {
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    };

    return await subscribeNotification(token, payload);
  },

  async unsubscribeUser(token, endpoint) {
    return await unsubscribeNotification(token, endpoint);
  },
};
