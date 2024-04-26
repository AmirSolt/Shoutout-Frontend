<script lang="ts">
	export let data
	const {schedule} = data
</script>


<form class="felx flex-col justify-center items-center p-4" method="post">
	<div class="card mb-4 p-4 variant-glass">
		<h1 class="text-xl font-bold">Intro</h1>
		<p>
			Send a congrats for special events
		</p>
	</div>


	<div class="card mb-4 p-4 variant-glass-error">
		<h1 class="text-xl font-bold">Error</h1>
		<p>Should be hidden if no form error</p>
	</div>

	<div class="card mb-4 p-4 variant-glass">
		<h1 class="text-xl font-bold">Date</h1>
		<label class="label">
			<span>Date (EST)</span>
			<input class="input" type="text" placeholder="2024/04/26" />
		</label>
	</div>


	<div class="card mb-4 p-4 variant-glass">
		<h1 class="text-xl font-bold">Message</h1>
		<label class="label">
			<span>Message</span>
			<input class="input" type="text" placeholder="Happy birthday John from Jane" />
		</label>
		<label class="label">
			<span>Image (Shown while the message is read)</span>
			<input class="input" type="file" />
		</label>
	</div>

	<div class="card mb-4 p-4 variant-glass">
		<h1 class="text-xl font-bold">Special Effects (Adds special effects to the video) </h1>
		<button class="btn variant-filled-primary">
			<p>Silver</p>
			<input type="hidden" name="special" value="silver">
		</button>
		<button class="btn variant-filled-primary">
			<p>Gold</p>
			<input type="hidden" name="special" value="gold">
		</button>
		<button class="btn variant-filled-primary">
			<p>Diamond</p>
			<input type="hidden" name="special" value="diamond">
		</button>
	</div>


	<div class="card mb-4 p-4 variant-glass">
		<h1 class="text-xl font-bold">Credit Card</h1>
	</div>


	<button class="btn variant-filled-primary">
		<p>Submit</p>
	</button>
</form>