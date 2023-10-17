<template>
    <div class="w-full border border-gray-200 rounded-lg shadow-lg md:hover:-translate-y-1 md:hover:shadow-xl duration-300">
        <div class="flex flex-col items-center p-10"> <!-- Removed justify-center -->
            <div class="mb-4"> <!-- Adjusted margin for image placement -->
                <img class="w-24 h-24 rounded-full" src="https://cdn.devdojo.com/images/june2021/headshot2.jpg">
                <!-- Smaller image -->
            </div>
            <div class="text-center"> <!-- Center text for name, instruments, and bio -->
                <h2 class="text-lg font-medium">{{ musicianData.name }}</h2>
                <div class="space-x-2 mt-2"> <!-- Added spacing between instruments -->
                    <span v-for="instrument in musicianData.instruments" :key="instrument"
                        class="text-blue-500 text-sm font-medium">
                        {{ instrument }}
                    </span>
                </div>
                <p class="text-gray-400 mt-4">{{ musicianData.bio }}</p>
            </div>
        </div>
        <div class="flex border-t border-gray-200 divide-x divide-gray-200"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    musicianData: { name: String, bio: String, styles: Array, instruments: Array }
});
</script>
