import { defaultSettings, getSetting } from '$lib/settings';
import { Setting } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return {
      key_required: await getSetting(Setting.KeyRequired)
    }
  } catch (error) {
    return {
      key_required: defaultSettings[Setting.KeyRequired]
    }
  }
};