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
		Modal,
		Toggle
	} from 'flowbite-svelte';

	import {
		SearchOutline,
		PaperClipOutline,
		DownloadSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import type { Log } from '../api/log/get/+server';
	import type { Key } from '../api/key/get/+server';

	let logs: Log[] = [];
	let apikeys: Key[] = [];
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
		dateMax: '',
		apikey: 0
	};
	let showFileReader = false;
	let fileHighlighting = false;
  let attachment = {
    filename: '',
    content: '',
    lines: ['']
  }
  $: {
    attachment.lines = fileHighlighting ? attachment.content.split('\n') : []
  }

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
		getApikeys();
	});

	async function getLogs() {
		logs = await api('/api/log/get', { options: searchOptions });
	}

	async function getApikeys() {
		apikeys = await api('/api/key/get');
	}

	async function openFile(filename: string) {
		try {
			let res = await api<{ content: string }>('/api/file/' + filename);
      attachment.filename = filename
			attachment.content = res.content;
			showFileReader = true;
		} catch (e) {}
	}

	function getLineClass(line: string) {
		if (line.match(/(error|failed)/gi)) return 'bg-red-700';
		return '';
	}
</script>

<div class="flex flex-row items-end gap-3 mb-2 w-full">
	<Label for="dateMin"
		>Limit
		<Select items={limitOptions} bind:value={searchOptions.limit} on:change={getLogs} />
	</Label>
	<Label for="apikey"
		>Api Key
		<Select
			items={[{ value: 0, name: 'Any' }, ...apikeys.map((v) => ({ value: v.id, name: v.name }))]}
			bind:value={searchOptions.apikey}
			on:change={getLogs}
		></Select>
	</Label>
	<Label for="dateMin"
		>Min
		<Input id="dateMin" type="date" bind:value={searchOptions.dateMin} on:change={getLogs} /></Label
	>
	<Label for="dateMax"
		>Max
		<Input id="dateMax" type="date" bind:value={searchOptions.dateMax} on:change={getLogs} /></Label
	>
	<Label for="dateMax" class="ml-auto text-right"
		>Logs: {searchedLogs.length}
		<Input defaultClass="w-full" type="text" placeholder="Search..." bind:value={searchText}>
			<SearchOutline class="w-5 h-5" slot="left" />
		</Input></Label
	>
</div>
<div class="flex flex-row justify-between items-end gap-3 mb-2 w-full">
	<div class="w-full flex flex-row gap-2 ml-auto justify-end items-center">
		<div>
			{#if filters.type != ''}
				<Button color="blue" size="sm" on:click={() => (filters.type = '')}
					>type: {filters.type}</Button
				>
			{/if}
			{#if filters.user != ''}
				<Button color="blue" size="sm" on:click={() => (filters.user = '')}
					>user: {filters.user}</Button
				>
			{/if}
			{#if filters.machine != ''}
				<Button color="blue" size="sm" on:click={() => (filters.machine = '')}
					>machine: {filters.machine}</Button
				>
			{/if}
		</div>
	</div>
</div>

<Table class="w-full table-fixed">
	<colgroup>
		<col width="150px" />
		<col width="" />
		<col width="" />
		<col width="" />
		<col width="" />
		<!-- <col width="80px" /> -->
	</colgroup>
	<TableHead>
		<TableHeadCell>Date</TableHeadCell>
		<TableHeadCell>Type</TableHeadCell>
		<TableHeadCell>User</TableHeadCell>
		<TableHeadCell>Machine</TableHeadCell>
		<TableHeadCell>Message</TableHeadCell>
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
				<TableBodyCell>
					<div class="flex flex-row justify-between items-center gap-2">
						<div class="truncate" title={log.message || ''}>
							{log.message || ''}
						</div>
						{#if log.filename}
							<Button class="!p-2" color="light" size="xs" on:click={() => openFile(log.filename)}
								><PaperClipOutline /></Button
							>
						{/if}
					</div>
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
	<div class="flex flex-row justify-between">
		<Toggle bind:checked={fileHighlighting}>Highlighting</Toggle>
		<Button
			class="!p-2"
			outline
			href="data:text/plain;charset=utf-8,{encodeURIComponent(attachment.content)}"
			download="{attachment.filename}.txt"
		>
			<DownloadSolid size="lg" />
		</Button>
	</div>
	{#if fileHighlighting}
		<div class="flex flex-col">
			{#each attachment.lines as line}
				<div class={getLineClass(line) + ' font-mono'}>{line}</div>
			{/each}
		</div>
	{:else}
		<pre class="w-full">{attachment.content}</pre>
	{/if}
</Modal>
