<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg z-100 w-9/12">
      <!-- Add your content for the popup card here -->
      <slot>

				<div class="w-full bg-white">
					<div class="flex flex-col items-start justify-start w-full h-full p-4">
						<h4 class="w-full text-3xl font-bold">Create your band</h4>
						<div class="relative w-full mt-4 space-y-8">
							<div class="relative">
								<label class="font-medium text-gray-900">Name</label>
								<input type="text"
									id="bandNameInput"
									class="block w-full px-4 py-2 mt-2 text-lg placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
									data-primary="blue-600" data-rounded="rounded-lg"
									placeholder="Band" />
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
									class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-violet-500 rounded-lg hover:bg-violet-700 ease"
									data-primary="violet-500" data-rounded="rounded-lg">Log in</a>
							</div>
						</div>
					</div>
				</div>

      </slot>
      <!-- Add a close button or any other UI elements if needed -->
      <button @click="$emit('close')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
//faire defineprops avec le type d'entrée qu'on fait (id de groupe/musicien ?)
</script>

