<template>
	<div class="max-w-7xl px-5 flex flex-col space-y-5 w-full h-full items-center justify-center mx-auto">
		<div class="items-center flex">
			<div class="w-full mt-12 lg:flex">
				<div class="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
					<div class="flex items-center justify-center">
						<div class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full ring-violet-500 ring-2 ring-offset-2">
							<img v-if="!avatarUrl" src="../../assets/images/imageMain.jpg" class="object-cover w-full h-full">
							<img v-if="avatarUrl" src={{ avatarUrl }} class="object-cover w-full h-full">
						</div>
						<div class="flex flex-col items-start justify-center">
							<h4 class="font-bold text-xl text-gray-800">Absolomb</h4>
						</div>
						<div>
							<label className="button primary block" htmlFor="single">
								Upload
							</label>
							<input type="file" id="single" accept="image/*" @change="uploadAvatar($event)"/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="max-w-7xl px-5 py-10 flex space-x-5 w-full h-full items-center justify-center mx-auto">
			<div class="flex flex-col space-y-5 w-full h-full">
				<div class="relative w-full px-6 py-6 mx-auto bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">
					<button class="absolute top-4 right-4 px-2 py-1 text-sm text-white bg-violet-500 hover:bg-violet-600 rounded-lg duration-300" @click="">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
							class="lucide lucide-pen">
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
						</svg>
					</button>
					<h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
						Bio
					</h3>
					<p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
						Je joue depuis maintenant 3 ans du ukulélé, je maitrise quatorze accords et j'aime par
						dessus tout le son de la guimbarde.
					</p>
				</div>
				<div
					class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">
					<h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
						Past experiences jsp
					</h3>
					<p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
						1994 - j'ai joué pour la bo de adibou
					</p>
				</div>
			</div>
			<div class="flex flex-col space-y-5 w-full h-full">
				<div
					class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">
					<h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
						Instruments
					</h3>
					<p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
						Blablablablabla
					</p>
				</div>
				<div
					class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3">
					<h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
						Styles
					</h3>
					<p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
						Blablablablabla
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
  
<script setup lang="ts">

	import { createClient } from '@supabase/supabase-js'
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')

	let avatarUrl = ref('')
	

	async function downloadImage(path: string) {
		try {

			const { data, error } = await supabase.storage.from('avatars').download(path)

			if (error) {
				throw error
			}

			const url = URL.createObjectURL(data)
			avatarUrl.value = url
		}	 
		catch (error: any) {
			console.log('Error downloading image: ', error.message)
		}
	}

	async function uploadAvatar(event: any) {

		console.log('uploading...')

		try {

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = event.target.files[0]
			const fileExt = file.name.split('.').pop()
			const fileName = `${Math.random()}.${fileExt}`
			const filePath = `${fileName}`

			let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

			if (uploadError) {
				throw uploadError
			}
		} 
		catch (error: any) {
			alert(error.message)
		} 
  	}
</script>