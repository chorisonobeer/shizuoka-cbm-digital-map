<script lang="ts">
	import { Home, List, Camera, Info } from 'lucide-svelte';

	let {
		activeTab = 'home',
		onchange
	}: {
		activeTab: string;
		onchange: (tab: string) => void;
	} = $props();

	const navItems = [
		{ id: 'home', icon: Home, label: 'ホーム' },
		{ id: 'list', icon: List, label: '一覧' },
		{ id: 'images', icon: Camera, label: '写真' },
		{ id: 'about', icon: Info, label: '情報' },
	];
</script>

<nav class="tabbar">
	{#each navItems as item}
		{@const active = activeTab === item.id}
		<button
			class="nav-item"
			class:active
			aria-current={active ? 'page' : undefined}
			onclick={() => onchange(item.id)}
		>
			<item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
			<span class="nav-label">{item.label}</span>
		</button>
	{/each}
</nav>

<style>
	.tabbar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		padding: 0 4px;
		background-color: var(--bg-color, #f5f0e8);
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		flex: 1;
		padding: 6px 0;
		color: #9ca3af;
		text-decoration: none;
		transition: color 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
	}

	.nav-item:hover {
		color: #6b7280;
	}

	.nav-item.active {
		color: var(--primary-color, #1a2e44);
	}

	.nav-label {
		font-size: 10px;
		font-weight: 500;
		line-height: 1;
		white-space: nowrap;
	}

	.nav-item.active .nav-label {
		font-weight: 600;
	}
</style>
