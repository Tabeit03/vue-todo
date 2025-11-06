<template>
  <nav class="bg-[#7b7b12b6] text-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold hover:text-blue-200">Todo App</RouterLink>
      <div class="flex items-center gap-4">
        <template v-if="user">
          <span class="text-sm">{{ user.email }}</span>
          <button
            @click="signOut"
            class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 font-medium transition-colors"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="bg-green-500 px-4 py-2 rounded hover:bg-green-400 font-medium"
          >
            Login
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { user, signOut } = useAuth();
</script>