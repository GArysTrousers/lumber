<script lang="ts">
	import { api } from '$lib/api';
	import {
		Avatar,
		Button,
		Card,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Heading,
		Input,
		Label,
		Modal
	} from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import { onMount } from 'svelte';
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';
	interface User {
		id: number;
		username: string;
		email: string;
	}
	let users: User[] = [];
	let selectedUser: User = {
		id: 0,
		username: '',
		email: ''
	};
	let newUser = {
		username: '',
		email: '',
		password: ''
	};
	let showNewUser = false;
	let showEditUser = false;

	export let data: PageData;

	onMount(async () => {
		getUsers();
	});

	async function getUsers() {
		try {
			users = await api('/api/user/get');
		} catch (e) {}
	}

	function openNewUserModal() {
		newUser = {
			username: '',
			email: '',
			password: ''
		};
		showNewUser = true;
	}

	async function createNewUser() {
		try {
			let res = await api('/api/user/create', { newUser });
			getUsers();
			showNewUser = false;
		} catch (e) {}
	}

  function openEditUserModal(user: User) {
		selectedUser = user;
		showEditUser = true;
	}

	async function updateUser() {
		try {
			let res = await api('/api/user/update', { user: selectedUser });
			getUsers();
			showEditUser = false;
		} catch (e) {}
	}

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
	<Heading tag="h2">Users</Heading>
	<div class="flex flex-row">
		<Button on:click={openNewUserModal}>New User</Button>
	</div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each users as u}
			<Card>
				<div class="flex flex-row justify-between">
					<div class="flex gap-2">
						<Avatar />
						<div class="flex flex-col">
							<h5 class="text-xl font-medium text-gray-900 dark:text-white">{u.username}</h5>
							<div class="text-sm text-gray-500 dark:text-gray-400">Admin</div>
						</div>
					</div>

					<div class="my-auto">
						<Button class="!p-2" color="light"><DotsHorizontalOutline /></Button>
						<Dropdown class="p-1">
							<DropdownItem class="rounded-lg">Change Password</DropdownItem>
							<DropdownItem class="rounded-lg" on:click={() => openEditUserModal(u)}>Edit</DropdownItem>
							<DropdownDivider></DropdownDivider>
							<DropdownItem
								class="rounded-lg hover:!bg-red-500"
								on:click={() => api('/api/user/erase', { username: u.username })}
								>Delete</DropdownItem
							>
						</Dropdown>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</div>

<Modal title="New User" size="xs" bind:open={showNewUser}>
	<Label>
		Username
		<Input bind:value={newUser.username} />
	</Label>
	<Label>
		Password
		<Input type="password" bind:value={newUser.password} />
	</Label>
	<Label>
		Email (optional)
		<Input type="email" bind:value={newUser.email} />
	</Label>
	<div class="flex justify-end">
		<Button on:click={createNewUser}>Create</Button>
	</div>
</Modal>

<Modal title="Edit User" size="xs" bind:open={showEditUser}>
	<Label>
		Username
		<Input bind:value={selectedUser.username} />
	</Label>
	<Label>
		Email (optional)
		<Input type="email" bind:value={selectedUser.email} />
	</Label>
	<div class="flex justify-end">
		<Button on:click={updateUser}>Save</Button>
	</div>
</Modal>

<style>
</style>
