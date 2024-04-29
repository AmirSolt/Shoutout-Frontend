<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let data;
	const { queueCount, costAmount, maxCapacity } = data;
</script>

<h1>
	queueCount: {queueCount}
</h1>

<form class="felx flex-col justify-center items-center p-4" method="post">
	<div class="card mb-4 p-4 space-y-2">
		<div class="flex flex-row justify-start items-center gap-2">
			<Avatar
				src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
				width="w-16"
				rounded="rounded-full"
			/>
			<h1 class="text-xl font-bold">Character</h1>
		</div>
		<p>Send a congrats for special events</p>
	</div>
	{#if $page.form?.errorMessage != null}
		<div class="card mb-4 p-4 variant-filled-error space-y-2">
			<h1 class="text-xl font-bold">Error</h1>
			<p>{$page.form.errorMessage}</p>
		</div>
	{/if}

	{#if queueCount > maxCapacity}
		<div class="card mb-4 p-4 variant-filled-warning space-y-2">
			<h1 class="text-xl font-bold">Queue is Full: {queueCount}/{maxCapacity}</h1>
			<p>We're currently at max capacity, please submit a video request later.</p>
		</div>
	{/if}

	<div class="card mb-4 p-4 space-y-4">
		<h1 class="text-xl font-bold">Message</h1>
		<label class="label">
			<span>Message</span>
			<textarea
				class="textarea"
				name="message"
				rows="4"
				maxlength="120"
				placeholder="Happy birthday John, ... from Jane."
				required
			/>
		</label>
		<label class="label">
			<span>Images</span>
			<input class="input" type="file" name="images" multiple required />
		</label>

		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" required />
			<p>I understand any inappropriate image/text can be removed or modified.</p>
		</label>

		<button class="btn variant-filled-primary w-52">
			<p>${costAmount} (USD)</p>
		</button>
	</div>
</form>
<br />
<br />
<br />
