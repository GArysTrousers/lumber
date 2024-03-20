<script lang="ts">
	import { Heading, Input, Card, Button, Spinner, A } from 'flowbite-svelte';
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let result: 'waiting' | 'success' | 'failure' = 'waiting';

	onMount(async () => {
		logout();
	});
	async function logout() {
		try {
			let res = await api('/api/auth/logout');
			if (res) result = 'success';
		} catch (e) {}
	}
</script>

<div class="flex flex-row justify-center items-center mb-5">
	<Card>
		<div class="flex flex-col gap-3">
			<Heading class="text-center">Lumber</Heading>
			<div class="flex flex-col gap-2 text-center">
				{#if result == 'waiting'}
					<div>Logging out <Spinner></Spinner></div>
				{:else if result == 'success'}
					<div>You have been logged out.</div>
					<div><A href="/auth">Click here to login</A></div>
				{:else}
					<div></div>
				{/if}
			</div>
		</div>
	</Card>
</div>

<style>
</style>
