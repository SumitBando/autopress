<script lang="ts">
	import { onMount } from 'svelte'

	/**
	 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
	 * before a user is prompted to "install" a web site to a home screen on mobile.
	 *
	 * @deprecated Only supported on Chrome and Android Webview.
	 */
     interface BeforeInstallPromptEvent extends Event {
		/**
		 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
		 * This is provided for user agents that want to present a choice of versions to the user such as,
		 * for example, "web" or "play" which would allow the user to chose between a web version or
		 * an Android version.
		 */
		readonly platforms: Array<string>

		/**
		 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
		 */
		readonly userChoice: Promise<{
			outcome: 'accepted' | 'dismissed'
			platform: string
		}>

		/**
		 * Allows a developer to show the install prompt at a time of their own choosing.
		 * This method returns a Promise.
		 */
		prompt(): Promise<void>
	}

	let deferredPrompt: BeforeInstallPromptEvent | null = null
	let showInstallPrompt = false

	onMount(() => {
		window.addEventListener('beforeinstallprompt', event => {
			// console.log('addEventListener')
			deferredPrompt = event as BeforeInstallPromptEvent
			setTimeout(() => {
				showInstallPrompt = true
			}, 6000) // Show the install banner after 1 minute
		})
	})

	async function installApp(): Promise<void> {
		// console.log('installApp', deferredPrompt)
		if (!deferredPrompt) return

		await deferredPrompt.prompt() // Manually show the install prompt
		const choiceResult = await deferredPrompt.userChoice
		if (choiceResult.outcome === 'accepted') {
			console.log('User installed the app')
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker
					.register('/service-worker.js')
					.then(() => console.log('Service Worker Registered'))
					.catch(err => console.error('Service Worker Error', err))
			}
		}
		// else {
		// 	console.log('User dismissed the install prompt')
		// }
		showInstallPrompt = false
		deferredPrompt = null
	}
</script>

{#if showInstallPrompt}
<div class="install-banner">
    <img src="/golfflag.png" alt="App Icon" />
    <p>Install this app for quick access</p>
    <button on:click={installApp}>Install</button>
</div>
{/if}


<style>
	.install-banner {
		position: fixed;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.install-banner img {
		width: 32px;
		height: 32px;
	}
	.install-banner button {
		background: green;
		color: white;
		border: none;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
