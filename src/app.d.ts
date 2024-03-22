/// <reference types="@sveltejs/kit" />

import type { User } from "$lib/auth";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
    sessionId: string;
    session: Session
  }
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}


export interface Session extends User {
  
}