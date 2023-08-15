<template>
	<section class="w-full bg-white tails-selected-element">
		<div class="p-4 mx-auto max-w-7xl">
			<div @click="openPopup()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"> 
				+ Create a band
			</div>
			<Transition>
				<BandPopup v-if="showPopup" @close="closePopup" class="" :isEditable="false" :isCreation="true" :bandId="0"></BandPopup>
			</Transition>
		</div>
	</section>
</template>

<script lang="ts" setup>

	let showPopup = ref(false);

	function openPopup() {
		showPopup.value = true;
		console.log('open')
	}
	function closePopup() {
		showPopup.value = false;
	}

</script>