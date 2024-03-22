import { permission } from '$lib/auth';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals}) => {
  permission(locals.session);
};