<template>

    <div class="bg-slate-900 text-white p-5 rounded-3xl w-12/12 flex justify-between h-[25vh]">
        <div class="w-3/12">
            <p class ="mt-[-10px] text-3xl font-semibold border-b-2 w-9/12"> {{ band.name }} </p>
            <div class="mt-[10px] flex flex-wrap gap-2 my-1">
                <div class=" text-black font-semibold rounded-lg bg-white px-2" v-for="style in band.styles" :key="style">
                    {{ style }}
                </div>
            </div>
        </div>
        <div class ="bg-slate-800 rounded-3xl w-9/12 border-2 text-center p-3">
            <p class="h-full overflow-y-scroll line-clamp-3">
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
        name : "Iron Maiden",
        description : "bio",
        styles : ["Jazz", "Blues", "Rock", "Jazz", "Blues", "Afro Beat"]
    }
</script>
