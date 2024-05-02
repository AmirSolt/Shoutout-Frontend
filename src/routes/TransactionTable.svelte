<script lang="ts">
	export let transactions: Transaction[];
</script>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>User Name</th>
				<th>Amount</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as trans, i}
				<tr>
					<td>{trans.user_name}</td>
					<td>${trans.amount}</td>
					<td>{new Date(trans.created).toDateString()}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
