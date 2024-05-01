<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Smile } from 'lucide-svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		invalidateAll();
	});
</script>

<div class="card-mod flex flex-col justify-center items-center gap-4">
	<Smile color="#15CE48" size={150} />

	<div class="flex flex-col justify-center items-center text-center gap-2">
		<h1 class="text-xl font-bold">Thank you for your donation!</h1>
		<p>Your help means a lot.</p>
	</div>

	<a href="/" class="btn variant-ringed"> ← Home </a>
</div>
