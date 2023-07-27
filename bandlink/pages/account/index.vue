<template>
    <div class="m-5 flex gap-5">
        <div class="relative group cursor-pointer">
            <img class="object-cover rounded-full border-2 border-black group-hover:opacity-30 duration-250" style="width:5vw; height:5vw;" src="../../assets/images/image01.png" />
            <div class="opacity-0 group-hover:opacity-100 duration-300 absolute flex text-xs text-black font-semibold inset-0 flex items-center justify-center text-center">Changer photo</div>
            
        </div>
    
        <p class="w-8/12 text-5xl text-black font-semibold">{{ musician.name }}</p>
        
        <input type="checkbox" id="react-option" value="" class="hidden peer" required="">
        <label id="lookingButton" for="react-option" @click="updateLookingForBands()" class="inline-flex items-center justify-between p-5 border-2 text-white rounded-lg cursor-pointer duration-500 hover:bg-slate-900 bg-black">                           
            <div class="block flex gap-8">
                <img class="h-6 w-6"  src="../../assets/images/loupe.png" />
                <div class="w-full text-lg font-semibold" id="lookingButtonText">Look for a band</div>
            </div>
        </label>
        
        
    </div>

    <h1 class="pt-10 font-semibold text-3xl text-black">
        Instruments
    </h1>

    <div class="flex gap-2 py-5">
        <div class="rounded-md text-center bg-auto bg-slate-600 px-2 hover:bg-slate-400 duration-300" v-for="instrument in musician.instruments" :key="instrument">
                    {{ instrument }}
        </div>
    </div>

    <h1 class="pt-10 font-semibold text-3xl text-black">
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
        let buttonText = document.getElementById("lookingButtonText");

        if(clicked) {
            clicked = false;
            button.className = "inline-flex items-center justify-between p-5 border-2 text-white rounded-lg cursor-pointer hover:bg-slate-900 duration-500 bg-black";
            buttonText.textContent = "Look for a band"
        }
        else {
            clicked = true;
            button.className = "inline-flex items-center justify-between p-5 border-2 rounded-lg cursor-pointer duration-500 text-black border-black";
            buttonText.textContent = "Looking for a band ..."
        }

        
        updateLookingForBands();        
    }
</script>