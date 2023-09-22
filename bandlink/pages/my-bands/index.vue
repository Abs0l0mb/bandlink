<template>
	<section class="w-full bg-white tails-selected-element">
		<div class="p-4 mx-auto max-w-7xl">
			<div @click="openCreationPopup()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"> 
				+ Create a band
			</div>
			<Transition>
				<BandPopup v-show="showCreationPopup" @close="closeCreationPopup" class="" :isEdition="false" :isCreation="true" :bandId="0"></BandPopup>
			</Transition>
		</div>
		<div class="px-20 py-5 space-y-3">
			<div v-for="bandData in bandsData">
				<BandCard :bandData="bandData"></BandCard>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>

	import { createClient } from '@supabase/supabase-js'
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')
	const userSession = await supabase.auth.getSession()

	let bandsData = ref([])
	getBands(bandsData)
	let showCreationPopup = ref(false)

	function openCreationPopup() {
		showCreationPopup.value = true
	}

	function closeCreationPopup() {
		showCreationPopup.value = false
	}

	function openEditionPopup() {
		showCreationPopup.value = true
	}

	function closeEditionPopup() {
		showCreationPopup.value = false
	}

	async function getBands(bandsData: any) {

		let { data, error } = await supabase
		.rpc('get_bands_by_user', {
			email: userSession.data.session?.user.email,
			language: 'ENG'
		})
		console.log(data, error)

		bandsData.value = data;
	}

</script>
