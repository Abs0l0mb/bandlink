<template>
    <div class="w-full rounded-lg mt-2">
        <input autocomplete="off" @focusout="clearSearchTerm()" v-model="searchTerm" class="mb-1 w-full bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50" type="text" id="search">
        <ul v-if="searchItems.length" class="absolute rounded-md w-full z-50">
            <li class="bg-gray-200 hover:bg-gray-400 active:bg-slate-500 cursor-pointer px-1" v-for="item in searchItems" :key="item.name" @click="selectItem(item)">
                {{ item.name }}
            </li>
        </ul>
        <div class="flex flex-wrap gap-1" id="filters"> 
            <div class="bg-gray-200 rounded-md py-1 px-2 w-fit" v-for="filter in filters" :key="filter.name"> {{ filter.name }} <span class="px-1 cursor-pointer hover:bg-slate-300" @click="deleteItem(filter)">x</span></div>
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

    const clearSearchTerm = () => {
        setTimeout(() => {
            searchTerm.value = "";
        }, 100);
    }

    const selectItem = async (item) => {

        let isAlreadyInList = false;

        for(let value of filters._rawValue) {
            if(value.name == item.name)
                isAlreadyInList = true
        }

        if(!isAlreadyInList)
            filters.value.push({name: item.name});
        searchTerm.value = "";

        //emit('refreshFilters', filters);
    }
    
    const deleteItem = (item) => {
        for(let i = 0; i < filters.value.length; i++) {
            if(filters.value[i].name == item.name)
                filters.value.splice(i, 1);
                //emit('refreshFilters', filters)  
        }
    }

    let selectedItem = ref('')

</script>
