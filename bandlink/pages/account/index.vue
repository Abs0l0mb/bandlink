<template>
    <div class="m-5 flex gap-5">
        <div class="relative group cursor-pointer">
            <img class="object-cover rounded-full group-hover:opacity-30 duration-250" style="width:5vw; height:5vw;" src="../../assets/images/image01.png" />
            <div class="opacity-0 group-hover:opacity-100 duration-300 absolute flex text-xs text-white font-semibold inset-0 flex items-center justify-center text-center">Changer photo</div>
            
        </div>
    
        <p class="w-8/12 text-5xl font-semibold">{{ musician.name }}</p>
        
        <input type="checkbox" id="react-option" value="" class="hidden peer" required="">
        <label id="lookingButton" for="react-option" @click="updateLookingForBands()" class="inline-flex items-center justify-between p-5 border-2 text-gray-500 border-gray-200 rounded-lg cursor-pointer hover:text-gray-300 hover:text-gray-600 duration-500 hover:bg-gray-50 text-gray-400 bg-gray-800 hover:bg-gray-700">                           
            <div class="block flex gap-8">
                <img class="h-6 w-6"  src="../../assets/images/loupe.png" />
                <div class="w-full text-lg font-semibold">Looking for band</div>
            </div>
        </label>
        
        
    </div>

    <h1 class="pt-10 font-semibold text-3xl">
        Instruments
    </h1>

    <div class="flex gap-2 py-5">
        <div class="rounded-md  text-center bg-auto bg-slate-600 px-2 hover:bg-slate-400 duration-300" v-for="instrument in musician.instruments" :key="instrument">
                    {{ instrument }}
        </div>
    </div>

    <h1 class="pt-10 font-semibold text-3xl">
        Styles
    </h1>

    <div class="flex gap-2 py-5">
        <div class="rounded-md  text-center bg-auto bg-slate-600 px-2 hover:bg-slate-400 duration-300" v-for="style in musician.styles" :key="stlye">
                    {{ style }}
        </div>
    </div>

    <h1 class="pt-10 font-semibold text-3xl">
        Bio
    </h1>


    
</template>


<script setup>

    let clicked = false;

    let musician = {
        name : "Absolomb",
        instruments : ["guitare", "piano", "contrebasse"],
        styles : ["metal", "rock", "jazz", "classique", "batucada brésilienne"]
    }


    function updateLookingForBands() {

        let button = document.getElementById("lookingButton");
 
        if(!clicked) {
            clicked = true;
            button.className = "inline-flex items-center justify-between p-5 border-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-300 hover:text-gray-600 duration-500 hover:bg-gray-50 hover:bg-gray-700 border-blue-500 text-blue-200 bg-blue-500"
        }
        else {
            clicked = false;
            button.className = "inline-flex items-center justify-between p-5 border-2 rounded-lg cursor-pointer hover:text-gray-300 hover:text-gray-600 duration-500 hover:bg-gray-50 hover:bg-gray-700 text-gray-500 border-gray-200"
        }

        

        console.log();
        //text-gray-500 bg-white border-gray-200

        //border-blue-500 text-blue-200 bg-blue-500
        
    }
</script>