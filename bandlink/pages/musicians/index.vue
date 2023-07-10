<template>
    <div class="flex gap-10 mx-auto mb-10 sm:pb-20 pt-12 md:pt-28">
        <div class="flex flex-col gap-y-8">
            <p class="w-8/12 text-5xl font-semibold">
                Musicians
            </p>
            <p class="text-xl">
            </p>
            <NuxtLink to="/account" class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full w-max border-2 border-cortex-light-green cursor-pointer">Get Started</NuxtLink>

            <FilterList :items="styles"></FilterList>

        </div>
    </div>
</template> 
<script setup lang="ts">

    const styles = ref([
        {
            "id": 1,
            "name": "pop"
        },
        {
            "id": 2,
            "name": "rock"
        },
        {
            "id": 3,
            "name": "jazz"
        },
        {
            "id": 4,
            "name": "metal"
        },
        {
            "id": 5,
            "name": "funk"
        },
        {
            "id": 6,
            "name": "soul"
        },
    ]);

</script>