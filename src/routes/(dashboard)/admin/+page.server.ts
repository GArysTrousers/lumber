import { defaultSettings, getSetting } from '$lib/settings';
import { Setting } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
  try {
    return {
      max_log_age: await getSetting(Setting.MaxLogAge)
    }
  } catch (e) {
    console.log(e);
  }
  return {
    max_log_age: defaultSettings[Setting.MaxLogAge]
  }
};