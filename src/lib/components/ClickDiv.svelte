<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	export let link: string = '/';

	let _class: string = '';
	export { _class as class };
	const default_class: string =
		'flex h-full items-center justify-center border border-gray-800 hover:bg-gray-800';
</script>

<div
	role="button"
	class={twMerge(default_class, _class)}
	tabindex="0"
	on:click={() => {
		window.location.href = link;
	}}
	on:mouseover={() => {
		document.body.style.cursor = 'pointer';
	}}
	on:mouseout={() => {
		document.body.style.cursor = 'default';
	}}
	on:touchstart={() => {
		document.body.style.cursor = 'pointer';
	}}
	on:touchend={() => {
		document.body.style.cursor = 'default';
	}}
	on:keydown={() => {
		document.body.style.cursor = 'pointer';
	}}
	on:keyup={() => {
		document.body.style.cursor = 'default';
	}}
	on:focus={() => {
		document.body.style.cursor = 'pointer';
	}}
	on:blur={() => {
		document.body.style.cursor = 'default';
	}}
>
	<slot />
</div>
