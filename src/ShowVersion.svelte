<script lang="ts">
	let versionPromise = (async () => {
		try {
			const res = await fetch('/version.json')
			const data = await res.json()
			console.log(data)
			return data
		} catch (err) {
			console.error('Error loading version info:', err)
		}
	})()
</script>

{#await versionPromise then version}
	<div class="mt-4 text-slate-400 text-center">Build date: {version?.buildDate.split('T')[0]} githash: {version?.commitHash.slice(0,7)}</div>
{/await}
