<script lang="ts">
  import { goto } from "$app/navigation";
	import { Heading, Input, Card, Button } from 'flowbite-svelte';
	import { api } from '$lib/api';

	let username = '';
	let password = '';
	async function login() {
		try {
			let res = await api('/api/auth/login', { username, password });
      if (res) goto('/')
		} catch (e) {}
	}
</script>

<div class="flex flex-row justify-center items-center mb-5">
	<Card>
		<div class="flex flex-col gap-3">
			<Heading class="text-center">Lumber</Heading>
			<div class="flex flex-col gap-2">
				<Input bind:value={username} placeholder="Username" />
				<Input bind:value={password} placeholder="Password" type="password" />
				<Button on:click={login}>Logon</Button>
			</div>
		</div>
	</Card>
</div>

<style>
</style>
