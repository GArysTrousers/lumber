import { getSetting } from '$lib/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return {
      keyRequired: await getSetting('key_required')
    }
  } catch (error) {
    return {
      keyRequired: true
    }
  }
};