<script lang="ts">
	import ClickDiv from './ClickDiv.svelte';
	import laptop from '$lib/assets/laptop.svg';

	type SidebarLink = {
		name: string;
		path: string;
	};

	export let sidebar_links: SidebarLink[] = [
		{
			name: 'Home',
			path: '/',
		},
		{
			name: 'Projects',
			path: '/projects',
		},
		{
			name: 'About',
			path: '/about',
		},
	];
</script>

<sidebar
	class="grid h-full w-1/12 min-w-fit grid-rows-6 border-r border-gray-800 bg-gray-900 text-center text-gray-100"
>
	<ClickDiv>
		<img alt="profile" src={laptop} class="h-24 w-24" />
	</ClickDiv>
	<div class="row-span-4 flex flex-col items-center">
		{#each sidebar_links as link}
			<a
				href={link.path}
				class="flex h-12 w-full items-center justify-center border border-gray-800 hover:bg-gray-800"
			>
				{link.name}
			</a>
		{/each}
	</div>
	<div
		class="row-span-1 flex flex-col items-center justify-center border-t border-gray-800"
	>
		<a href="https://www.github.com/standup2001" target="_blank">Github</a>
		Stan van Dijk
	</div>
</sidebar>
