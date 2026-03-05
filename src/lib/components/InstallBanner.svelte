<script lang="ts">
	import { onMount } from 'svelte';
	import { X, Download, Share } from 'lucide-svelte';

	const STORAGE_KEY = 'pwa-install-banner-dismissed';
	const SUPPRESS_HOURS = 24;

	let visible = $state(false);
	let deferredPrompt: any = null;
	let isIOS = $state(false);

	function wasRecentlyDismissed(): boolean {
		const ts = localStorage.getItem(STORAGE_KEY);
		if (!ts) return false;
		const elapsed = Date.now() - Number(ts);
		return elapsed < SUPPRESS_HOURS * 60 * 60 * 1000;
	}

	function dismiss() {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
		visible = false;
	}

	function isStandalone(): boolean {
		return window.matchMedia('(display-mode: standalone)').matches
			|| ('standalone' in navigator && (navigator as any).standalone === true);
	}

	async function handleInstall() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			await deferredPrompt.userChoice;
			deferredPrompt = null;
			dismiss();
		}
	}

	onMount(() => {
		if (isStandalone() || wasRecentlyDismissed()) return;

		// iOS Safari detection
		const ua = navigator.userAgent;
		isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

		if (isIOS) {
			// iOS Safari doesn't fire beforeinstallprompt
			if (!(navigator as any).standalone) {
				visible = true;
			}
			return;
		}

		// Android Chrome etc.
		window.addEventListener('beforeinstallprompt', (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			if (!wasRecentlyDismissed()) {
				visible = true;
			}
		});
	});
</script>

{#if visible}
	<div class="install-banner">
		{#if isIOS}
			<Share size={16} />
			<span class="install-text">共有ボタンから「ホーム画面に追加」でアプリとして使えます</span>
		{:else}
			<Download size={16} />
			<span class="install-text">アプリとしてインストールできます</span>
			<button class="install-btn" onclick={handleInstall}>インストール</button>
		{/if}
		<button class="close-btn" onclick={dismiss} aria-label="閉じる">
			<X size={18} />
		</button>
	</div>
{/if}

<style>
	.install-banner {
		position: fixed;
		bottom: 60px;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		padding-bottom: calc(10px + env(safe-area-inset-bottom));
		background: var(--primary-color, #1a2e44);
		color: #fff;
		font-size: 13px;
		z-index: 10000;
	}

	.install-text {
		flex: 1;
		line-height: 1.4;
	}

	.install-btn {
		flex-shrink: 0;
		padding: 5px 12px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 4px;
		background: transparent;
		color: #fff;
		font-size: 13px;
		cursor: pointer;
	}

	.install-btn:active {
		background: rgba(255, 255, 255, 0.15);
	}

	.close-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
		cursor: pointer;
	}

	.close-btn:active {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
