<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
      <p class="text-gray-600 mb-6">An unexpected error occurred.</p>
      <button
        @click="reloadPage"
        class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
      >
        Reload Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const reloadPage = () => {
  window.location.reload();
};
</script>