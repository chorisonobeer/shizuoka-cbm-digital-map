<script lang="ts">
	import { Home, List, Search, Camera, Info } from 'lucide-svelte';
</script>

<div class="tabbar">
	<ul>
		<li><a href="/"><div class="icon"><Home size={20} /></div><div class="text">ホーム</div></a></li>
		<li><a href="/list"><div class="icon"><List size={20} /></div><div class="text">一覧</div></a></li>
		<li><a href="/category"><div class="icon"><Search size={20} /></div><div class="text">カテゴリ</div></a></li>
		<li><a href="/images"><div class="icon"><Camera size={20} /></div><div class="text">写真から探す</div></a></li>
		<li><a href="/about"><div class="icon"><Info size={20} /></div><div class="text">マップについて</div></a></li>
	</ul>
</div>

<style>
	.tabbar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding-right: 18px;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		width: 100%;
	}

	li {
		width: 20%;
		text-align: center;
	}

	a {
		color: rgb(153, 153, 153);
		text-decoration: none;
	}

	.icon {
		line-height: 20px;
	}

	.text {
		font-size: 10px;
	}
</style>
