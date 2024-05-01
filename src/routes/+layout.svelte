<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead"
				><a href="/" class="flex justify-center items-center">
					<img src="/favicon.png" alt="Logo" class="w-12" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail"></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<div class="flex justify-center items-center w-full">
		<slot />
	</div>
</AppShell>
