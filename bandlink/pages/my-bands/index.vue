<template>
	<section class="w-full bg-white tails-selected-element">
		<div class="p-4 mx-auto max-w-7xl">
			<div @click="openPopup()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"> 
				+ Create a band
			</div>
			<Transition>
				<BandPopup v-show="showPopup" @close="closePopup" class="" :isEdition="false" :isCreation="true" :bandId="0"></BandPopup>
			</Transition>
		</div>
	</section>
</template>

<script lang="ts" setup>

	import { createClient } from '@supabase/supabase-js'
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')
	const userSession = await supabase.auth.getSession()

	let bandsData = ref([])
	getBands()
	let showPopup = ref(false)

	function openPopup() {
		showPopup.value = true
		console.log('open')
	}
	function closePopup() {
		showPopup.value = false
	}

	async function getBands() {
		let { data, error } = await supabase
		.rpc('get_bands_by_user', {
			email: userSession.data.session?.user.email

		})
		console.log(data)
		console.log(error)
	}

</script>
