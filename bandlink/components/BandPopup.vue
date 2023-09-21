<template>
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-white rounded-lg p-8 shadow-lg z-100 w-9/12">
			<!-- Add your content for the popup card here -->
			<slot>
				<div class="w-full bg-white">
					<h4 class="w-full text-3xl text-center font-bold">Create your band</h4>
					<div class="flex items-start justify-start w-full h-full p-4">
						<div class="relative w-full mt-4 space-y-8">
							<div class="relative">
								<label class="font-medium text-gray-900">Name</label>
								<input type="text"
									v-model="bandNameInput"
									class="block w-full px-4 py-2 mt-2 text-lg placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
									data-primary="blue-600" data-rounded="rounded-lg"
									placeholder="Band" />
							</div>
							<div class="relative">
								<label class="font-medium text-gray-900">Bio</label>
								<textarea
									v-model="bandBioInput"
									style="resize: none;"
									class="block w-full h-[20vh] px-4 py-2 mt-2 text-lg placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
									data-primary="blue-600" data-rounded="rounded-lg" placeholder="Bio"></textarea>
							</div>
							<div class="flex gap-x-4">
								<div class="relative w-6/12">
									<label class="font-medium text-gray-900">Styles</label>
									<ItemList :items="stylesResponse.data" key="Styles" @added-item-to-list="addStyle" @removed-item-from-list="removeStyle" class="w-4/12"></ItemList>
								</div>
								<div class="relative w-6/12">
									<label class="font-medium text-gray-900">Searching for</label>
									<ItemList :items="musiciansResponse.data" key="Styles" @added-item-to-list="addMusician" @removed-item-from-list="removeMusician" class="w-4/12"></ItemList>
								</div>
							</div>

							<div class="relative" @click="createBand(); $emit('close')">
								<a href="#_"
									class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-violet-500 rounded-lg hover:bg-violet-700 ease"
									data-primary="violet-500" data-rounded="rounded-lg">Create</a>
							</div>
						</div>
					</div>
				</div>
			</slot>
			<!-- Add a close button or any other UI elements if needed -->
			<button @click="$emit('close')" class="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg">
				Close
			</button>
		</div>
  	</div>
</template>

<script setup lang="ts">

	import { createClient } from '@supabase/supabase-js'
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')

	const props = defineProps({
		isCreation: Boolean,
		isEdition: Boolean,
		bandId: Number,
	})

	const userSession = await supabase.auth.getSession();
	
	const areInputDisabbled = ref((!props.isCreation && !props.isEdition) ? false: true);
	const bandNameInput = ref('');
	const bandBioInput = ref('');

	let bandStyleList: number[] = []
	let bandMusicianList: number[] = []

	if(!props.isCreation)
		fetchAndDisplayInfos();

	let stylesResponse = await supabase.rpc('get_styles_by_language', {
		lang: 'ENG'
	});
	
	if(stylesResponse.error)
		console.log(stylesResponse.error);

	let musiciansResponse = await supabase.rpc('get_musicians_by_language', {
		lang: 'ENG'
	});

	if(musiciansResponse.error)
		console.log(musiciansResponse.error);


	function addStyle(style: {style_id: number, name: string}) {
		bandStyleList.push(style.style_id)
	}

	function removeStyle(style: {style_id: number, name: string}) {
		bandStyleList.splice(bandStyleList.findIndex(style_id => { return style_id == style.style_id }), 1)
	}

	function addMusician(musician: {musician_id: number, name: string}) {
		bandMusicianList.push(musician.musician_id)
	}

	function removeMusician(musician: {musician_id: number, name: string}) {
		bandMusicianList.splice(bandMusicianList.findIndex(musician_id => { return musician_id == musician.musician_id }), 1)
	}

	async function createBand() {
		let { data, error } = await supabase
		.rpc('create_band_and_return_id', {
			announcement_text: "", 
			band_name: bandNameInput.value, 
			bio_text: bandBioInput.value,
			rehearsal_frequency: 1,
			styles: bandStyleList,
			musicians: bandMusicianList,
			admin_mail: userSession.data.session?.user.email
		})
		console.log(data)
		console.log(error)
	}

	async function fetchAndDisplayInfos() {
		//fetch band infos with id of props
		//bandNameInput.value = bandName
		//bandBioInput.value = bandBio
	}
</script>