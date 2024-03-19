/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
    sessionId: string;
    session: {
      username: string;
    }
  }
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
