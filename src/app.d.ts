/// <reference types="@sveltejs/kit" />

import type { User } from "$lib/auth";
import type { Session } from "mega-session";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      session: AppSession;
    }
    // interface Platform {}
    // interface Session {}
    // interface Stuff {}
  }
}

export interface AppSession extends Session {
  data: User;
}