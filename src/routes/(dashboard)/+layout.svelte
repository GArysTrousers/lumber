<script>
	import { page } from '$app/stores';
	import { CogOutline } from 'flowbite-svelte-icons';
	import '../../app.css';
	import { Button, DarkMode, Dropdown, DropdownItem, Heading } from 'flowbite-svelte';
	let darkmodebtn =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 bottom-2 z-50';

	const styles = {
		nav: 'px-3 py-1 text-gray-500 dark:text-gray-300',
		activeNav: 'px-3 py-1 text-gray-500 dark:text-gray-200 border-b-2 border-b-white'
	};
	let links = [
		{
			url: '/',
			pattern: '^/$',
			label: 'Logs'
		},
		{
			url: '/keys',
			pattern: '^/keys',
			label: 'Keys'
		},
		{
			url: '/scripts',
			pattern: '^/scripts',
			label: 'Scripts'
		},
		{
			url: '/analyse',
			pattern: '^/analyse',
			label: 'Analyse'
		}
	];
</script>

<svelte:head>
	<title>Lumber</title>
</svelte:head>
<DarkMode btnClass={darkmodebtn} />

<div class="flex flex-row justify-center p-5">
	<div class="w-full max-w-6xl">
		<div class="flex flex-row mb-5">
			<Heading><a href="/">Lumber</a></Heading>
			<div class="flex flex-row items-end gap-5">
				{#each links as link}
					<a
						class={$page.url.pathname.match(link.pattern) ? styles.activeNav : styles.nav}
						href={link.url}
					>
						<span class="nav-link-text">{link.label}</span>
					</a>
				{/each}
				<div class="flex flex-row gap-1">
          <Button color="alternative" class="!p-2"><CogOutline /></Button>
          <Dropdown class="p-1">
            <DropdownItem class="rounded-lg" href="/admin">Settings</DropdownItem>
            <DropdownItem class="rounded-lg" href="/auth/logout">Logout</DropdownItem>
          </Dropdown>
					<!-- <Button color="alternative" class="!p-2" on:click={() => goto('/admin')}>Logout</Button>
					<Button color="alternative" class="!p-2" on:click={() => goto('/admin')}
						><CogOutline />
					</Button> -->
				</div>
			</div>
		</div>
		<slot />
	</div>
</div>
