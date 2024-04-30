<script lang="ts">
	export let product: Product;
	export let selectedProductID: string;
</script>

<button
	class="card flex flex-col justify-center items-start text-start p-2 mx-2 w-36 {selectedProductID ==
	product.id
		? 'variant-filled-primary'
		: ''}"
	on:click={() => (selectedProductID = product.id)}
	type="button"
>
	<div class="flex">
		<img src={product.thumb_url} alt="Product" class="w-36" />
	</div>
	<span>{product.name}</span>
	<span>{product.description}</span>
</button>
