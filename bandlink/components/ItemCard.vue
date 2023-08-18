<template>
    <div
        class="bg-white text-black p-5 rounded-3xl w-12/12 flex justify-between h-[25vh] shadow-lg hover:-translate-y-1 hover:shadow-xl duration-900">
        <div class="w-3/12">
            <p class="mt-[-10px] text-3xl font-semibold border-b-2 w-9/12"> {{ band.name }} </p>
            <div class="mt-[10px] flex flex-wrap gap-2 my-1">
                <div class="text-black font-semibold rounded-lg px-2" v-for="style in band.styles" :key="style">
                    {{ style }}
                </div>
            </div>
        </div>
        <div class="rounded-3xl w-9/12 bg-gray-200 text-center p-3">
            <p class="text-gray-600 h-full line-clamp-3">
                {{ band.description }}
            </p>
        </div>
    </div>
</template>

<script setup>
/*
requete base de donnée
*/

let band = {
    name: "Iron Maiden",
    description: "salut on est un groupe et lorem ipsum jsp quoi mais ça va être trop bien les répet et tout",
    styles: ["Jazz", "Blues", "Rock", "Jazz", "Blues", "Afro Beat"]
}
</script>

