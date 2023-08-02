<template>
	<section class="h-[640px] bg-white tails-selected-element">
		<div class="max-w-7xl px-5 py-20 flex flex-col space-y-5 w-full h-full items-center justify-center mx-auto">
			<div class="flex h-full w-full bg-gray-300 rounded-md">

				<div class="relative group cursor-pointer">
					<img class="object-cover rounded-full border-2 border-black group-hover:opacity-30 duration-250"
						style="width: 10vw; height: 10vw" src="../../assets/images/image01.png" />
					<div
						class="opacity-0 group-hover:opacity-100 duration-300 absolute flex text-xs text-black font-semibold inset-0 flex items-center justify-center text-center">
						Changer photo
					</div>
				</div>

				<p class="w-7/12 text-5xl text-black font-semibold">
					{{ musician.name }}
				</p>

				<input type="checkbox" id="react-option" value="" class="hidden peer" required="" />
				<label id="lookingButton" for="react-option" @click="updateLookingForBands()"
					class="inline-flex items-center p-5 border-2 border-violet-500 text-white rounded-lg cursor-pointer duration-500 hover:bg-violet-600 bg-violet-500">
					<div class="block flex gap-6">
						<img class="h-6 w-6" src="../../assets/images/loupe.png" />
						<div class="w-full text-lg font-semibold" id="lookingButtonText">
							Look for a band
						</div>
					</div>
				</label>
			</div>

			<div class="flex space-x-5 w-full h-full">
				<div class="h-full w-full bg-gray-300 rounded-md">
					<h1 class="px-2 font-semibold text-3xl text-gray-900">Instruments</h1>

					<div class="gap-2 p-3">
						<div class="rounded-md text-center bg-gray-800 text-white px-2 hover:bg-slate-600 duration-300"
							v-for="instrument in musician.instruments" :key="instrument">
							{{ instrument }}
						</div>
					</div>
				</div>
				<div class="flex h-full w-full bg-gray-300 rounded-md">
					<h1 class="font-semibold text-3xl text-gray-900">Styles</h1>

					<div class="flex gap-2 py-5">
						<div class="rounded-md text-center bg-auto bg-gray-800 text-white px-2 hover:bg-slate-600 duration-300"
							v-for="style in musician.styles" :key="stlye">
							{{ style }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
let clicked = false;

let musician = {
	name: "Absolomb",
	instruments: ["guitare", "piano", "contrebasse"],
	styles: ["metal", "rock", "jazz", "classique", "batucada brésilienne"],
};

function updateLookingForBands() {
	let button = document.getElementById("lookingButton");
	let buttonText = document.getElementById("lookingButtonText");

	if (clicked) {
		clicked = false;
		button.className =
			"inline-flex items-center justify-between p-5 border-2 border-violet-500 text-white rounded-lg cursor-pointer hover:bg-violet-600 duration-500 bg-violet-500";
		buttonText.textContent = "Look for a band";
	} else {
		clicked = true;
		button.className =
			"inline-flex items-center justify-between p-5 border-2 border-violet-500 rounded-lg cursor-pointer duration-500 text-black bg-violet-100 hover:bg-violet-200";
		buttonText.textContent = "Looking for a band";
	}

	updateLookingForBands();
}
</script>
