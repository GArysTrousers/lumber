import { defaultSettings, getSetting } from '$lib/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return {
      key_required: await getSetting('key_required')
    }
  } catch (error) {
    return {
      key_required: defaultSettings.key_required
    }
  }
};