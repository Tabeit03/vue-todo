<template>
  <div>
    <Navbar v-if="!loading" />
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-[#d1d186]">
      <div class="text-center">Loading...</div>
    </div>
    <div v-else-if="!user" class="min-h-screen flex items-center justify-center bg-[#d1d186]">
      <div class="text-center p-8 bg-[#7b7b12b6] rounded-lg shadow-md max-w-md mx-4">
        <h1 class="text-4xl font-bold mb-4 text-gray-800">Welcome to Todo App</h1>
        <p class="text-gray-200 mb-6">
          Manage your tasks efficiently with our simple and elegant todo application. <br /> Login or create an account to get started.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/login"
            class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-medium transition-colors"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else class="min-h-screen py-8">
      <TodoList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Navbar from '@/components/Navbar.vue';
import TodoList from '@/components/TodoList.vue';

const { user, loading } = useAuth();
</script>