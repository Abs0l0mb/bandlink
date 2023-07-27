<template>
	
	<div @click="sideBar()" class="fixed h-[5vh] w-[5vh] bg-black ml-5 mt-5 rounded-lg">

	</div>

	<div id="sideBar" shown="false" class="mt-16 ml-5 rounded-xl bg-black w-2/12 h-[500px] p-3 fixed duration-500 hidden">
	</div>

	<div class="flex gap-10 mx-auto pb-10 pt-12 px-10">
		<div class="flex flex-col gap-y-8">
			<p class="w-8/12 text-5xl font-semibold">Bands</p>
		</div>
	</div>

	<ItemCard> </ItemCard>
</template>
<script setup lang="ts">

	function sideBar() {
		let sideBar = document.getElementById("sideBar");
		
		if(sideBar) {
			if(sideBar.getAttribute('shown') == "false") {
				sideBar.className = "mt-16 ml-5 rounded-xl bg-black w-2/12 h-[500px] p-3 fixed duration-500";
				sideBar.setAttribute('shown', 'true')
			}
			else {
				sideBar.className = "mt-16 ml-5 rounded-xl bg-black w-2/12 h-[500px] p-3 fixed duration-500 hidden";
				sideBar.setAttribute('shown', 'false')
			}
		} 
	}
</script>
