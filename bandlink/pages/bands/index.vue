<template>
	
	<div @click="showSideBar = !showSideBar" class="cursor-pointer fixed h-[5vh] w-[5vh] bg-black ml-5 mt-5 rounded-lg">

	</div>

	<Transition name="lToRFade">
		<div v-if="showSideBar" id="sideBar" class="transition-all mt-20 ml-5 rounded-xl bg-black w-2/12 h-[500px] p-3 fixed duration-250">
		</div>
	</Transition>

	<div class="px-20 py-5">
		<div class="flex gap-10 mx-auto pb-10 pt-12 px-10">
			<div class="flex flex-col gap-y-8">
				<p class="w-8/12 text-5xl font-semibold">Bands</p>
			</div>
		</div>

		<ItemCard @click="openPopup()" class="hover:scale-[1.02] transition-all duration-400">
		</ItemCard>

		<Transition>
			<PopupCard v-if="showPopup" @close="closePopup" class="">
			</PopupCard>
		</Transition>
	</div>
</template>

<style scoped>
	.lToRFade-enter-active,
	.lToRFade-leave-active {
		transition: all 0.25s ease;
	}

	.lToRFade-enter-from,
	.lToRFade-leave-to {
		opacity: 0;
		transform: translateX(-20px);
	}
</style>

<script setup lang="ts">

	let showSideBar = ref(false)

	import PopupCard from '~/components/PopupCard.vue';

	let showPopup = ref(false);

	function openPopup() {
		showPopup.value = true;
		console.log(showPopup)
	}
	function closePopup() {
		showPopup.value = false;
	}
	
</script>

<style>
.v-enter-active,
.v-leave-active {
	transition: opacity 250ms ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
