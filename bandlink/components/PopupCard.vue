<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg">
      <!-- Add your content for the popup card here -->
      <slot>
        let's goo !
      </slot>
      <!-- Add a close button or any other UI elements if needed -->
      <button @click="$emit('close')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
//faire defineprops avec le type d'entrée qu'on fait (id de groupe/musicien ?)
</script>

