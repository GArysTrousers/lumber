import { defaultSettings, getSetting } from '$lib/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
  try {
    return {
      max_log_age: await getSetting('max_log_age')
    }
  } catch (e) {
    console.log(e);
  }
  return {
    max_log_age: defaultSettings.max_log_age
  }
};