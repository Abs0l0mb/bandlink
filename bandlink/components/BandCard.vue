<template>
    <div
        class="overflow-hidden border border-gray-200 bg-white text-black p-5 rounded-3xl sm:w-[80vw] md:w-[90vw] flex flex-col sm:flex-row justify-between h-[auto] sm:h-[29vh] shadow-lg hover:-translate-y-1 hover:shadow-xl duration-900">
        <div class="w-full sm:w-3/12 mb-4 sm:mb-0">
            <p class="text-xl sm:text-2xl md:text-3xl font-semibold border-b-2 w-9/12 line-clamp-3">{{ bandData.name }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
                <div class="text-black font-semibold rounded-lg text-sm sm:text-base md:text-lg px-2"
                    v-for="style in bandData.styles" :key="style">
                    {{ style }}
                </div>
            </div>
        </div>
        <div class="rounded-3xl bg-gray-200 text-center p-3 sm:w-[75%]">
            <p class="text-gray-600 text-xs sm:text-sm md:text-base line-clamp-4">
                {{ bandData.bio }}
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    bandData: { annoucement: String, bio: String, id: Number, name: String, role_key: String, styles: Array }
})
</script>

