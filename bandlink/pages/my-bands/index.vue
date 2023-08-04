<template>
	<section class="w-full bg-white tails-selected-element">
		<div class="p-4 mx-auto max-w-7xl">
			<div class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600" @click="openPopup()"> 
				+ Create a band
			</div>
			<Transition>
				<CreateBandPopup v-if="showPopup" @close="closePopup" class=""></CreateBandPopup>
			</Transition>
		</div>
	</section>
</template>

<script lang="ts" setup>

	let showPopup = ref(false);

	function openPopup() {
		showPopup.value = true;
	}
	function closePopup() {
		showPopup.value = false;
	}

</script>