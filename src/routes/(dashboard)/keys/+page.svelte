<script lang="ts">
	import { api } from '$lib/api';
	import dayjs from 'dayjs';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Button,
		Toggle,
		Popover
	} from 'flowbite-svelte';
	import { CloseOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import type { Key } from '../../api/key/get/+server.js';

  export let data;
	let keys: Key[] = [];
	let searchedKeys: Key[] = [];
	let searchText = '';
	let newKeyName = '';

	onMount(async () => {
		keys = await api('/api/key/get');
		search();
	});

	function search() {
		if (searchText === '') searchedKeys = keys;
		const searchTextLower = searchText.toLowerCase();
		searchedKeys = keys.filter((v) => {
			return v.name && v.name.toLowerCase().includes(searchTextLower);
		});
	}

	async function newKey() {
		try {
			await api('/api/key/create', { name: newKeyName });
			keys = await api('/api/key/get');
			search();
			newKeyName = '';
		} catch (error) {
			console.log(error);
		}
	}

  async function erase(id:number) {
    try {
			await api('/api/key/erase', { id });
			keys = await api('/api/key/get');
			search();
			newKeyName = '';
		} catch (error) {
			console.log(error);
		}
  }

  async function toggleRequired() {
    try {
			await api('/api/settings/set', { key: 'key_required', value: data.key_required });
		} catch (error) {
			console.log(error);
		}
  }
</script>
<div class="flex flex-row justify-between mb-3">
  <div class="flex flex-row gap-3">
    <Toggle class="whitespace-nowrap" on:change={toggleRequired} bind:checked={data.key_required}>Require Key</Toggle>
  </div>
  <div class="flex flex-row justify-end gap-3 w-full">
    <Input class="max-w-64" bind:value={newKeyName} placeholder="New Key Name" />
    <Button on:click={newKey}>Create</Button>
  </div>
</div>

<Table>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Code</TableHeadCell>
		<TableHeadCell>Logs</TableHeadCell>
		<TableHeadCell>Date</TableHeadCell>
		<TableHeadCell />
	</TableHead>
	<TableBody>
		{#each searchedKeys as key}
			<TableBodyRow class="row">
				<TableBodyCell>{key.name}</TableBodyCell>
				<TableBodyCell>{key.code}</TableBodyCell>
				<TableBodyCell>{key.count}</TableBodyCell>
				<TableBodyCell>{dayjs(key.date).format('DD-MMM-YYYY')}</TableBodyCell>
				<TableBodyCell>
					<div class="flex flex-row justify-end hover-over-row-show gap-2">
						<Button class="!p-2" size="sm" color="light" title="Clear Logs" on:click={() => {}}><TrashBinSolid /></Button>
						<Button class="!p-2" size="sm" color="light" title="Delete Key" on:click={() => erase(key.id)}><CloseOutline /></Button>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{:else}
			<TableBodyRow>
				<TableBodyCell class="text-center" colspan="4">None</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<style >
  :global(tr .hover-over-row-show) {
    @apply opacity-0 transition-opacity duration-200;
  }
  :global(tr:hover .hover-over-row-show) {
    @apply opacity-100;
  }
</style>