<template>
    <div
        class="bg-white text-black p-5 rounded-3xl w-12/12 flex justify-between h-[25vh] shadow-lg hover:-translate-y-1 hover:shadow-xl duration-900">
        <div class="w-3/12">
            <p class="mt-[-10px] text-3xl font-semibold border-b-2 w-9/12"> {{ bandData.name }} </p>
            <div class="mt-[10px] flex flex-wrap gap-2 my-1">
                <div class="text-black font-semibold rounded-lg px-2" v-for="style in bandData.styles" :key="style">
                    {{ style }}
                </div>
            </div>
        </div>
        <div class="rounded-3xl w-9/12 bg-gray-200 text-center p-3">
            <p class="text-gray-600 h-full line-clamp-3">
                {{ bandData.bio }}
            </p>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        bandData: { annoucement: String, bio: String, id: Number, name:String, role_key: String, styles : Array }
    })
</script>

