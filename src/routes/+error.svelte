<script lang="ts">
	import { page } from '$app/stores';
	const status = $page.status as number;
	const error = $page.error as Error;
	const url = $page.url as URL;
	console.log(status, error);
</script>

{#if status === 404}
	<div>
		No page found at this path
		<span class="text-blue-300">"{url.pathname}"</span>
	</div>
	<div>Go back to <a href="/">home</a></div>
	<h1 class="text-red-500">{status}: {error.message}</h1>
{/if}
