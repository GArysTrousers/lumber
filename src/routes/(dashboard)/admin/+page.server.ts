import { defaultSettings, getSetting } from '$lib/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return {
      max_log_age: await getSetting('max_log_age')
    }
  } catch (error) {
    return {
      max_log_age: defaultSettings.max_log_age
    }
  }
};