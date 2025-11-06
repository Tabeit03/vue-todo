<template>
  <div>
    <Navbar />
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">Loading...</div>
    </div>
    <div v-else class="min-h-screen py-8">
      <TodoForm :todo-id="id" :is-edit="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Navbar from '@/components/Navbar.vue';
import TodoForm from '@/components/TodoForm.vue';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);
const { user, loading } = useAuth();

onMounted(() => {
  if (!loading.value && !user.value) {
    router.push('/login');
  }
});
</script>