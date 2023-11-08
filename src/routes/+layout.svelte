<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';
</script>

<main class="flex h-screen">
	<Sidebar />
	<div class="p-10">
		<slot />
	</div>
</main>
