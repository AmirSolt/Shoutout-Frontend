<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Product from './Product.svelte';
	import { error } from '@sveltejs/kit';
	export let data;
	let { products } = data;

	if (products == null) {
		throw error(500, 'Something went wrong!');
	}

	let selectedProductID = products[0].id;
</script>

<form
	class="felx flex-col justify-center items-center p-4"
	method="post"
	enctype="multipart/form-data"
>
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

	{#if products.every((product) => product.queueCount > product.queueCountMax)}
		<div class="card mb-4 p-4 variant-filled-warning space-y-2">
			<h1 class="text-xl font-bold">Queue is Full</h1>
			<p>We're currently at max capacity, please submit a video request later.</p>
		</div>
	{/if}

	<div class="card mb-4 p-4 space-y-4">
		<label class="label">
			<span class="text-xl font-bold">Email</span>
			<input class="input" type="email" name="email" placeholder="example@email.com" required />
		</label>

		<label class="label">
			<span class="text-xl font-bold">Message</span>
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
			<span class="text-xl font-bold">Images</span>
			<input
				class="input"
				type="file"
				name="images"
				multiple
				required
				accept="image/png, image/jpeg, image/jpg"
			/>
		</label>

		<label class="label">
			<span class="text-xl font-bold">Tiers</span>
			<div class="flex flex-row justify-center items-center">
				<Product product={products[0]} bind:selectedProductID />
				<Product product={products[1]} bind:selectedProductID />
			</div>
			<input type="hidden" name="product_id" value={selectedProductID} />
		</label>

		<label class="flex justify-center items-start space-x-2">
			<input class="checkbox" type="checkbox" required />
			<p>I understand the content is something to modification.</p>
		</label>

		<button class="btn variant-filled-primary w-52">
			<p>Submit</p>
		</button>
	</div>
</form>
<br />
<br />
<br />
