<template>
    <input type="text" id="search" placeholder="palceholderText" v-model="searchTerm">

    <ul v-if="searchItems.length">
        <li>
            Showing {{ searchItems.length }} of {{ items.length }} results
        </li>
        <li v-for="item in searchItems" :key="item.name" @click="selectCountry(country.name)">
            {{ item.name }}
        </li>
    </ul>
</template>

<script>

    import {ref, computed, defineProps} from 'vue'
    //const { items } = defineProps(['items']);

    export default {
        setup(items) {

            let searchTerm = ref('')

            const searchItems = computed(() => {

                if (searchTerm.value === '') {
                    return []
                }

                let matches = 0

                return items.filter(item => {

                    if (item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) && matches < 10) {
                        
                        matches++
                        
                        return item
                    }
                });
            });

            const selectItem = (item) => {
                /* here goes the adding to the list of filters, refreshing of the list, etc...*/
                selectedItem.value = item
                searchTerm.value = ''
            }
            
            let selectedItem = ref('')

            return {
                items,
                searchTerm,
                searchItems,
                selectItem,
                selectedItem
            }
        }
    }
</script>
