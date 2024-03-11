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
		Label,
		Select,
		Modal
	} from 'flowbite-svelte';

	import {
		SearchOutline,
		FilterOutline,
		PaperClipOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import type { Log } from '../api/log/get/+server';

	let logs: Log[] = [];
	let showFilters = false;
	let searchText = '';
	let filters = {
		type: '',
		user: '',
		machine: ''
	};
	const limitOptions = [
		{ value: 500, name: '500' },
		{ value: 2000, name: '2000' },
		{ value: 0, name: 'All' }
	];
	const searchOptions = {
		limit: 500,
		dateMin: '',
		dateMax: ''
	};
	let showFileReader = false;
	let fileContent = '';

	$: searchTextLower = searchText.toLowerCase();

	$: searchedLogs = logs
		.filter((v) => {
			return (
				(filters.type === '' || filters.type == v.type) &&
				(filters.user === '' || filters.user == v.user) &&
				(filters.machine === '' || filters.machine == v.machine)
			);
		})
		.filter((v) => v.searchString.includes(searchTextLower));

	onMount(async () => {
		getLogs();
	});

	async function getLogs() {
		logs = await api('/api/log/get', { options: searchOptions });
	}

	async function openFile(filename: string) {
		try {
			let res = await api<{ content: string }>('/api/file/' + filename);
			fileContent = res.content
      showFileReader = true;
		} catch (e) {}
	}
</script>

{#if showFilters}
	<div class="flex flex-row items-end gap-3 mb-2 w-full">
		<Label for="dateMin"
			>Limit
			<Select items={limitOptions} bind:value={searchOptions.limit} />
		</Label>
		<Label for="dateMin"
			>Min
			<Input id="dateMin" type="date" bind:value={searchOptions.dateMin} /></Label
		>
		<Label for="dateMax"
			>Max
			<Input id="dateMax" type="date" bind:value={searchOptions.dateMax} /></Label
		>
		<Button on:click={getLogs}>Apply</Button>
	</div>
{/if}
<div class="flex flex-row justify-between items-end gap-3 mb-2 w-full">
	<div class="flex flex-row items-center gap-3">
    <Button class="!p-3" on:click={() => (showFilters = !showFilters)}
      ><FilterOutline class="outline-none" /></Button
    >
    <div class="text-gray-400 whitespace-nowrap">Logs: {searchedLogs.length}</div>
  </div>
  <div class="w-full flex flex-row gap-2 ml-auto justify-end items-center">
    <div>
      {#if filters.type != ''}
        <Button color="blue" size="sm" on:click={() => (filters.type = '')}>type: {filters.type}</Button>
      {/if}
      {#if filters.user != ''}
        <Button color="blue" size="sm" on:click={() => (filters.user = '')}>user: {filters.user}</Button>
      {/if}
      {#if filters.machine != ''}
        <Button color="blue" size="sm" on:click={() => (filters.machine = '')}>machine: {filters.machine}</Button>
      {/if}
    </div>
    <div class="w-full max-w-sm">
      <Input defaultClass="w-full" type="text" placeholder="Search" bind:value={searchText}>
        <SearchOutline class="w-5 h-5" slot="left" />
      </Input>
    </div>
  </div>
</div>

<Table class="w-full table-fixed">
  <colgroup>
    <col width="150px" />
    <col width="100px" />
    <col width="100px" />
    <col width="100px" />
    <col width="" />
    <col width="80px" />
  </colgroup>
	<TableHead>
		<TableHeadCell>Date</TableHeadCell>
		<TableHeadCell>Type</TableHeadCell>
		<TableHeadCell>User</TableHeadCell>
		<TableHeadCell>Machine</TableHeadCell>
		<TableHeadCell>Message</TableHeadCell>
		<TableHeadCell>File</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each searchedLogs as log}
			<TableBodyRow>
				<TableBodyCell>{dayjs(log.date).format('DD/MM/YY - hh:mma') || ''}</TableBodyCell>
				<TableBodyCell>
					{#if log.type != null}
						<Button color="light" size="xs" on:click={() => (filters.type = log.type)}
							>{log.type}</Button
						>
					{/if}
				</TableBodyCell>
				<TableBodyCell>
					{#if log.user != null}
						<Button color="light" size="xs" on:click={() => (filters.user = log.user)}
							>{log.user}</Button
						>
					{/if}
				</TableBodyCell>
				<TableBodyCell>
					{#if log.machine != null}
						<Button color="light" size="xs" on:click={() => (filters.machine = log.machine)}
							>{log.machine}</Button
						>
					{/if}
				</TableBodyCell>
				<TableBodyCell class="truncate" title="{log.message || ''}">{log.message || ''}</TableBodyCell>
				<TableBodyCell>
					{#if log.filename}
						<Button class="!p-2" color="light" size="xs" on:click={() => openFile(log.filename)}
							><PaperClipOutline /></Button
						>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{:else}
			<TableBodyRow>
				<TableBodyCell class="text-center" colspan="5">None</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title="File" size="lg" bind:open={showFileReader} autoclose outsideclose>
	<pre class="w-full">{fileContent}</pre>
</Modal>
