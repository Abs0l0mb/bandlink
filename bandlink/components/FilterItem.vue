<template>
    <div @click="$emit('remove')" class="bg-slate-700 rounded-md px-1">

    </div>
</template>

<script>

    import {ref, computed, defineProps} from 'vue'

    export default {
        props: {
            text: {
                type: String,
                required: true
            }
        },
        methods: {

        },
        setup(props) {
        }
    }
</script>
