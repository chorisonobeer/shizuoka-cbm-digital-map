<script lang="ts">
	import { page } from '$app/state';
	import { Home, List, Camera, Info } from 'lucide-svelte';

	const navItems = [
		{ href: '/', icon: Home, label: 'ホーム' },
		{ href: '/list', icon: List, label: '一覧' },
		{ href: '/images', icon: Camera, label: '写真' },
		{ href: '/about', icon: Info, label: '情報' },
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="tabbar">
	{#each navItems as item}
		{@const active = isActive(item.href)}
		<a
			href={item.href}
			class="nav-item"
			class:active
			aria-current={active ? 'page' : undefined}
		>
			<item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
			<span class="nav-label">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.tabbar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		padding: 0 4px;
		background-color: #E7E7E5;
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
	}

	.nav-item:hover {
		color: #6b7280;
	}

	.nav-item.active {
		color: var(--primary-color, #d2691e);
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
