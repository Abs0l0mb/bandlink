<template>
    <div class="w-full p-1 border border-slate-500 rounded-lg">
        <input class="mb-1 w-full bg-slate-800 p-1 rounded-md focus:border-white" type="text" id="search"  v-model="searchTerm">
        <ul v-if="searchItems.length">
            <li class="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 cursor-pointer rounded-md px-1" v-for="item in searchItems" :key="item.name" @click="selectItem(item)">
                {{ item.name }}
            </li>
        </ul>
        <div class="" id="filters"> 
            <li class="bg-slate-700 rounded-md px-1" v-for="filter in filters" :key="filter.name"> {{ filter.name }}</li>
        </div>
    </div>
</template>

<script setup>

    //import { emit } from 'process';
    import {ref, computed, defineProps} from 'vue'

    const props = defineProps({
        items: Array,
        key: String
    })

    let items = props.items

    let searchTerm = ref('')

    let filters = ref([])

    const searchItems = computed(() => {

        if (searchTerm.value === '') {
            return []
        }

        let matches = 0

        return items.filter(item => {

            if (item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) && matches < 10) {
                
                matches++;
                
                return item;
            }
        })
    })

    const selectItem = async (item) => {

        filters.value.push({name: item.name});

        console.log(filters._rawValue);

        //emit('addedStyleFilter', item);
    }
    
    let selectedItem = ref('')

</script>
