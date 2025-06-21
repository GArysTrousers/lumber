<script lang="ts">
	import { api } from '$lib/api';
	import { Card, Checkbox, Heading, Input, Radio, Select, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { Key } from '../../api/key/get/+server';
	import { page } from '$app/stores';

	let options = {
		type: '',
		user: true,
		machine: true
	};

	let file = {
		mode: 'none',
		text: '',
		filePath: '',
		variableName: ''
	};

	let apikey: {enabled: boolean; selected: string | null; keys: { name: string, value: string }[]} = {
		enabled: false,
		selected: null,
		keys: []
	};

	let pwsh = '';

	$: {
		pwsh = `Invoke-WebRequest "${$page.url.protocol}//${$page.url.host}/submit" -Method Post -Body @{`;
		pwsh += `\n\ttype    = "${options.type}"`;
		pwsh += `\n\tmessage = ""`;
		if (options.user) pwsh += `\n\tuser    = $env:USERNAME`;
		if (options.machine) pwsh += `\n\tmachine = $env:COMPUTERNAME`;
		if (file.mode === 'file') pwsh += `\n\tfile    = Get-Content -Path "${file.filePath}" -Raw`;
		else if (file.mode === 'text') pwsh += `\n\tfile    = "${file.text}"`;
		else if (file.mode === 'variable') pwsh += `\n\tfile    = $${file.variableName}`;
		if (apikey.enabled) pwsh += `\n\tapikey  = "${apikey.selected}"`;
		pwsh += `\n}`;
	}

	onMount(async () => {
		let res = await api<Key[]>('/api/key/get');
		apikey.keys = res.map((v) => ({ name: v.name, value: v.code }));
		apikey.selected = res[0].code;
	});
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-5">
		<Heading tag="h3">Script Options</Heading>
		<div class="flex flex-wrap gap-3">
			<Card class="flex flex-col gap-2">
				<div class="flex flex-row gap-3 items-center">
					<div class="text-xl whitespace-nowrap">Log Type</div>
					<Input bind:value={options.type} />
				</div>
				<div class="flex flex-row gap-3 items-center">
					<Checkbox class="w-6 h-6 text-xl rounded-md" bind:checked={options.user}></Checkbox>
					<div class="text-xl">Log User</div>
				</div>
				<div class="flex flex-row gap-3 items-center">
					<Checkbox class="w-6 h-6 text-xl rounded-md" bind:checked={options.machine}></Checkbox>
					<div class="text-xl">Log Computer</div>
				</div>
			</Card>

			<Card class="flex flex-col gap-2">
				<div class="text-xl">Attach File</div>
				<div class="flex flex-row gap-3">
					<Radio bind:group={file.mode} name="file" value="none">None</Radio>
					<Radio bind:group={file.mode} name="file" value="file">File</Radio>
					<Radio bind:group={file.mode} name="file" value="text">Text</Radio>
					<Radio bind:group={file.mode} name="file" value="variable">Variable</Radio>
				</div>
				{#if file.mode === 'file'}
					<div>
						<div>File Path</div>
						<Input bind:value={file.filePath} />
					</div>
				{:else if file.mode === 'text'}
					<div>
						<div>Text</div>
						<Textarea bind:value={file.text} rows="5" />
					</div>
				{:else if file.mode === 'variable'}
					<div>
						<div>Variable Name</div>
						<Input bind:value={file.variableName} />
					</div>
				{/if}
			</Card>

			<Card class="flex flex-col gap-3">
				<div class="flex flex-row gap-3 items-center">
					<Checkbox class="w-7 h-7 text-2xl rounded-md" bind:checked={apikey.enabled}></Checkbox>
					<div class="text-xl">Use API Key</div>
				</div>
				<Select disabled={!apikey.enabled} items={apikey.keys} bind:value={apikey.selected} />
			</Card>
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<Heading tag="h3">PowerShell</Heading>
		<pre class="code">{pwsh}</pre>
	</div>
</div>

<style>
	.code {
		@apply rounded-xl px-6 py-4 border border-primary-500 bg-gray-900;
	}
</style>
