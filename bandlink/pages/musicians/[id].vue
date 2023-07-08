<template>
    <div>
        <p>Cortex #{{ id }}</p>
    </div>
</template>

<script setup>
    const { id } = useRoute().params
</script>