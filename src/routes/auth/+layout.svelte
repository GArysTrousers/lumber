<script>
	import '../../app.css';
	import { DarkMode } from 'flowbite-svelte';
	let darkmodebtn =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-2 z-50';
</script>

<svelte:head>
	<title>Lumber</title>
</svelte:head>
<DarkMode btnClass={darkmodebtn} />

<div class="flex flex-row justify-center p-5">
	<div class="w-full max-w-5xl">
		<slot />
	</div>
</div>
