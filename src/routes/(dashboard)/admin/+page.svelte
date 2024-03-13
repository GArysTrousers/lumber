<script lang="ts">
	import { api } from '$lib/api';
	import { Button, Card, Heading, Input } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	interface User {
		username: string;
	}
	let users: User[] = [
		{
			username: 'ben.lee'
		}
	];

	export let data: PageData;

	async function saveCleanupSettings() {
		try {
			await api('/api/settings/set', { key: 'max_log_age', value: data.max_log_age });
		} catch (e) {}
	}
</script>

<div class="flex flex-col gap-5">
	<Card class="flex flex-col gap-5 w-full max-w-xl">
		<Heading tag="h2">Auto Cleanup</Heading>
		<div class="flex flex-col gap-5">
			<div class="flex flex-row items-center gap-3">
				Retain logs for <Input type="number" class="w-20" bind:value={data.max_log_age} /> days
			</div>
			<div class="flex flex-row gap-3 justify-end">
				<Button on:click={saveCleanupSettings}>Save</Button>
			</div>
			<hr />
			<div class="flex flex-row gap-3">
				<Button color="light" on:click={() => api('/admin/manual_cleanup')}>Run Cleanup</Button>
			</div>
		</div>
	</Card>
	<div class="flex flex-row">
		<Heading tag="h2">Users</Heading>
		<div class="flex flex-row gap-3">
			<Button>New</Button>
		</div>
	</div>
	<div class="flex flex-wrap">
		{#each users as u}
			<Card padding="sm">
				<div class="flex flex-col items-center">
					<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{u.username}</h5>
					<span class="text-sm text-gray-500 dark:text-gray-400">Admin</span>
					<div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
						<Button>Change Password</Button>
						<Button color="light" class="dark:text-white">Delete</Button>
					</div>
				</div>
			</Card>
		{:else}
			<div>None</div>
		{/each}
	</div>
</div>

<style>
</style>
