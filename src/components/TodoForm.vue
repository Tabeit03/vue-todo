<template>
  <div v-if="fetchLoading" class="text-center py-8">Loading...</div>
  <div v-else class="max-w-md mx-auto p-4 sm:p-6 bg-[#7d7d34b6] rounded-lg shadow-md mt-8">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ isEdit ? 'Edit Todo' : 'Add New Todo' }}
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="todo-input" class="block text-sm font-medium text-gray-300 mb-1">Todo Title</label>
        <input
          id="todo-input"
          type="text"
          v-model="formData.todo"
          placeholder="Enter todo title..."
          required
          :disabled="loading"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
          aria-required="true"
        />
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          :disabled="loading || !formData.todo?.trim()"
          class="flex-1 bg-[#0a80e1] text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update Todo' : 'Add Todo' }}
        </button>
        <button
          type="button"
          @click="router.push('/')"
          :disabled="loading"
          class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { todoService } from '@/services/todoService';
import type { TodoFormData } from '@/types/todo';
import { useRouter as vueRouter } from 'vue-router';

const props = defineProps<{
  todoId?: string;
  isEdit?: boolean;
}>();

const emit = defineEmits<{}>();

const { user } = useAuth();
const router = vueRouter();
const route = useRoute();
const formData = ref<TodoFormData>({ todo: '' });
const loading = ref(false);
const fetchLoading = ref(!!props.isEdit);

onMounted(async () => {
  if (props.isEdit && props.todoId && user.value) {
    try {
      const todo = await todoService.getTodoById(props.todoId, user.value.uid);
      if (todo) {
        formData.value = { todo: todo.todo };
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Fetch todo error:', error);
      router.push('/404');
    } finally {
      fetchLoading.value = false;
    }
  }
});

const handleSubmit = async () => {
  if (!formData.value.todo?.trim() || !user.value) return;
  loading.value = true;
  try {
    if (props.isEdit && props.todoId) {
      await todoService.editTodo(props.todoId, user.value.uid, formData.value);
    } else {
      await todoService.addTodo(user.value.uid, formData.value);
    }
    router.push('/');
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving todo. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>