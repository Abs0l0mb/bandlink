<template>
	<div @click="showSideBar = !showSideBar"
		class="cursor-pointer fixed h-[5vh] w-[5vh] bg-black ml-5 mt-5 rounded-lg z-100">

	</div>

	<Transition name="lToRFade">
		<div v-if="showSideBar" id="sideBar"
			class="transition-all mt-20 ml-5 rounded-xl bg-black w-2/12 h-[500px] p-3 fixed duration-250">
		</div>
	</Transition>

	<div class="px-[3vw] py-[3vh]">
		<div class="flex gap-10 mx-auto pb-[3vh] pt-[10vh] px-10">
			<div class="flex flex-col gap-y-8">
				<p class="w-8/12 text-5xl font-semibold">Bands</p>
			</div>
		</div>
		<div class="px-[4vw] py-[3vh] space-y-[4vh] sm:pr-4">
			<div v-for="bandData in bandsData">
				<BandCard :bandData="bandData"></BandCard>
			</div>
		</div>

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

	import { createClient } from '@supabase/supabase-js'
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')
	const userSession = await supabase.auth.getSession()

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


	let bandsData = ref([])
	let showCreationPopup = ref(false)

	async function getBands(bandsData: any) {

		let { data, error } = await supabase
			.rpc('get_bands', {
				language: 'ENG'
			})
		console.log(data)

		bandsData.value = data;
	}

	getBands(bandsData)

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
