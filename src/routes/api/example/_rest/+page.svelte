<script>
	export let data;
</script>

<div class="centered">
	<h1>todos</h1>

	<label>
		add a todo:
		<input
			type="text"
			autocomplete="off"
			on:keydown={async (e) => {
				if (e.key === 'Enter') {
					const input = e.currentTarget;
					const description = input.value;
					console.log(description);
					const response = await fetch('/api/_post/todo', {
						method: 'POST',
						body: JSON.stringify({ description }),
						headers: {
							'Content-Type': 'application/json',
						},
					});

					const { id } = await response.json();
					console.log(id);

					input.value = '';
				}
			}}
		/>
	</label>

	<ul class="todos">
		{#each data.todos as todo}
			<li>
				<label>
					<input
						type="checkbox"
						checked={true}
						on:change={async (e) => {
							const done = e.currentTarget.checked;

							await fetch(`/todo/${todo}`, {
								method: 'PUT',
								body: JSON.stringify({ done }),
								headers: {
									'Content-Type': 'application/json',
								},
							});
						}}
					/>
					<span>{todo}</span>
					<button
						aria-label="Mark as complete"
						on:click={async () => {
							await fetch(`/todo/${todo}`, {
								method: 'DELETE',
							});
						}}
					/>
				</label>
			</li>
		{/each}
	</ul>
</div>

<style>
	.centered {
		max-width: 20em;
		margin: 0 auto;
	}

	label {
		display: flex;
		width: 100%;
	}

	input[type='text'] {
		flex: 1;
	}

	span {
		flex: 1;
	}

	button {
		border: none;
		background: url(./remove.svg) no-repeat 50% 50%;
		background-size: 1rem 1rem;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	button:hover {
		opacity: 1;
	}
</style>
