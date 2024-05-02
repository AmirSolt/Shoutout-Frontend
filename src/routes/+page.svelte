<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Transaction from './TransactionTable.svelte';
	import { DollarSign } from 'lucide-svelte';
	import TransactionTable from './TransactionTable.svelte';
	export let data;
	let { characterName, pageData, maxTotalRaisedGoal } = data;
</script>

<div class="felx flex-col justify-center items-center p-4 md:max-w-4xl w-full">
	<!-- ================= -->
	<div class="card mb-4 p-4 space-y-2">
		<h1 class="text-xl font-bold">Big L Corp.</h1>
		<p>Send a congrats for special events</p>
	</div>
	<!-- ================= -->

	{#if $page.form?.errorMessage != null}
		<div class="card mb-4 p-4 variant-filled-error space-y-2">
			<h1 class="text-xl font-bold">Error</h1>
			<p>{$page.form.errorMessage}</p>
		</div>
	{/if}

	<!-- ================= -->
	<div class="card mb-4 p-4 space-y-4">
		<div class="flex flex-row justify-start items-center gap-2">
			<Avatar
				src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
				width="w-16"
				rounded="rounded-full"
			/>
			<h1 class="text-xl font-bold">Termination of {characterName}</h1>
		</div>
		<p>
			At the end of this fundraiser <b>{characterName}</b> will be terminated and replaced by a new character.
		</p>

		<div>
			<progress value={pageData.total_raised} max={maxTotalRaisedGoal} />
			<div class="flex flex-row justify-between items-center">
				<p>Raised: ${pageData.total_raised}</p>
				<p>Goal: ${maxTotalRaisedGoal}</p>
			</div>
		</div>
	</div>
	<!-- ================= -->

	<!-- ================= -->
	<form class="card mb-4 p-4 space-y-4" method="POST">
		<h1 class="text-xl font-bold">Donate</h1>

		<label class="label">
			<span class="text-lg">Username (public)</span>
			<input class="input" type="text" name="user_name" placeholder="Anonymous" value="Anonymous" />
		</label>

		<label class="label">
			<span class="text-lg">Amount</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><DollarSign /></div>
				<input type="text" name="amount" placeholder="5.0" value="5.0" />
				<div class="input-group-shim">USD</div>
			</div>
		</label>

		<button class="btn variant-filled-primary w-52">
			<p>Submit</p>
		</button>
	</form>
	<!-- ================= -->

	<!-- ================= -->
	<div class="card mb-4 p-4 space-y-4">
		<span class="text-xl font-bold">Highest Transactions </span>
		{#if pageData.highest_transactions.length > 0}
			<TransactionTable transactions={pageData.highest_transactions} />
		{:else}
			<div class="card p-2 m-2">
				<p>Empty</p>
			</div>
		{/if}
	</div>
	<!-- ================= -->

	<!-- ================= -->
	<div class="card mb-4 p-4 space-y-4">
		<span class="text-xl font-bold">Recent Transactions </span>
		{#if pageData.recent_transactions.length > 0}
			<TransactionTable transactions={pageData.recent_transactions} />
		{:else}
			<div class="card p-2 m-2">
				<p>Empty</p>
			</div>
		{/if}
	</div>
	<!-- ================= -->
</div>
<br />
<br />
<br />

<style>
	progress {
		background: #02a95c;
		color: #e6f6ef;
	}

	progress::-moz-progress-bar {
		background: #e6f6ef;
	}

	progress::-webkit-progress-value {
		background: #02a95c;
	}

	progress::-webkit-progress-bar {
		background: #e6f6ef;
	}
</style>
