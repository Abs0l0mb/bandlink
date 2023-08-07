<template>
	<section class="w-full bg-white tails-selected-element">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col lg:flex-row h-[95vh]">
				<div class="relative w-full bg-cover lg:w-6/12 xl:w-7/12 bg-gradient-to-r from-white via-white to-gray-100">
					<div
						class="relative flex flex-col items-center w-full h-full p-4 lg:p-8 xl:p-12 my-4 lg:my-0">
						<div class="lg:pt-8 flex flex-col items-start space-y-8 tracking-tight lg:max-w-3xl">
							<div class="relative text-center w-full lg:text-left lg:w-auto">
								<h2 class="text-5xl font-bold text-gray-900 xl:text-6xl">
									Bandlink
								</h2>
								<p class="mb-2 font-medium uppercase border-black ml-[30%] lg:ml-8 lg:px-8">
									Where music comes alive
								</p>
							</div>
							<p class="text-2xl text-gray-700">
								Connect with like-minded musicians effortlessly. Create bands, jam sessions, and
								collaborations with ease. Showcase your talent and find the perfect musical fit. Join the
								vibrant community of passionate musicians and unlock your true potential.
							</p>
						</div>
					</div>
				</div>

				<div class="w-full bg-white lg:w-6/12 xl:w-5/12">
					<div class="flex flex-col items-start justify-start w-full h-full p-4 lg:p-8 xl:p-12">
						<h4 class="w-full text-3xl font-bold">Sign in</h4>
						<div class="relative w-full mt-4 space-y-8">
							<div class="relative">
								<label class="font-medium text-gray-900">Email</label>
								<input type="text"
									id="emailInput"
									class="block w-full px-4 py-2 mt-2 text-lg placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
									data-primary="blue-600" data-rounded="rounded-lg"
									placeholder="Enter Your Email Address" />
							</div>
							<div class="relative">
								<label class="font-medium text-gray-900">Password</label>
								<input type="password"
									id="passwordInput"
									class="block w-full px-4 py-2 mt-2 text-lg placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
									data-primary="blue-600" data-rounded="rounded-lg" placeholder="Password" />
							</div>
							<div class="relative">
								<a href="#_"
									@keyup.enter="logIn()" 
									@click="logIn()"
									class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-violet-500 rounded-lg hover:bg-violet-700 ease"
									data-primary="violet-500" data-rounded="rounded-lg">Log in</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>

	import { createClient } from '@supabase/supabase-js'

	//console.log(process.env.VUE_APP_SUPABASE_URL, process.env.VUE_APP_SUPABASE_KEY)
	const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')

	async function logIn() {

		const { data, error } = await supabase.auth.signInWithPassword({
			email: (document.getElementById("emailInput") as HTMLInputElement).value,
			password: (document.getElementById("passwordInput") as HTMLInputElement).value,
		})

		if(!error)
			location.reload()		
	}

</script>