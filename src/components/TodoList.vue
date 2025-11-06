<template>
  <div v-if="loading" class="text-center py-8" role="status" aria-live="polite">Loading...</div>
  <div v-else class="max-w-2xl mx-auto p-4 bg-[#7b7b12b6]">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center">Todo List</h1>
    <!-- Add Todo Form -->
    <form @submit.prevent="handleAddTodo" class="mb-6 cursor-pointer flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        v-model="newTodoTitle"
        placeholder="Enter a new task..."
        class="flex-1 font-medium cursor-pointer p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
        aria-label="Enter a new task"
        :disabled="adding"
      />
      <button
        type="submit"
        :disabled="adding || !newTodoTitle.trim()"
        class="bg-gray-50 font-bold cursor-pointer py-3 px-6 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
      >
        {{ adding ? 'Adding...' : 'Add Task' }}
      </button>
    </form>
    <!-- Search & Filter -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        type="search"
        v-model="searchText"
        placeholder="Search by title..."
        class="flex-1 p-3 font-medium cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
        aria-label="Search todos by title"
      />
      <select
        v-model="filterStatus"
        @change="handleFilterChange"
        class="p-3 cursor-pointer font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
        aria-label="Filter todos by status"
      >
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </div>
    <!-- Todo Items -->
    <ul role="list" aria-label="Todo list" class="space-y-4 mb-6">
      <li v-if="pageItems.length === 0" class="text-center py-8 font-bold text-[#d21111f4]">NO TASK FOUND.</li>
      <TodoItem
        v-for="todo in pageItems"
        :key="todo.id"
        :todo="todo"
        :on-toggle="handleToggle"
        :on-edit="handleEdit"
        :on-delete="handleDelete"
      />
    </ul>
    <!-- Pagination -->
    <nav v-if="totalPages > 1" aria-label="Pagination" class="flex justify-center items-center gap-4 text-sm">
      <button
        @click="handlePageChange(1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 font-medium bg-gray-300 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed"
      >
        « Back to page 1
      </button>
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 font-medium bg-gray-200 cursor-pointer border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed"
      >
        ‹ Prev
      </button>
      <span class="px-3 py-2 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 font-medium bg-gray-300 cursor-pointer border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed"
      >
        Next ›
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { todoService } from '@/services/todoService';
import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem.vue';

const { user } = useAuth();
const route = useRoute();
const router = useRouter();

const todos = ref<Todo[]>([]);
const newTodoTitle = ref('');
const searchText = ref('');
const filterStatus = ref<'completed' | 'incomplete' | ''>('');
const loading = ref(true);
const adding = ref(false);

const page = computed(() => parseInt(route.query.page as string || '1'));
const limit = 5;

let unsubscribe: (() => void) | null = null;

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

if (user.value) {
  unsubscribe = todoService.subscribeTodos(user.value.uid, (newTodos) => {
    todos.value = newTodos;
    loading.value = false;
  });
}

// Filtered todos
const filtered = computed(() => todos.value.filter((todo) => {
  const matchesSearch = searchText.value.trim() === '' || todo.todo.toLowerCase().includes(searchText.value.toLowerCase());
  const matchesStatus = filterStatus.value === '' ||
    (filterStatus.value === 'completed' && todo.completed) ||
    (filterStatus.value === 'incomplete' && !todo.completed);
  return matchesSearch && matchesStatus;
}));

const total = computed(() => filtered.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));
const currentPage = computed(() => Math.min(Math.max(1, page.value), totalPages.value));
const pageStart = computed(() => (currentPage.value - 1) * limit);
const pageItems = computed(() => filtered.value.slice(pageStart.value, pageStart.value + limit));

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim() || !user.value) return;
  adding.value = true;
  try {
    await todoService.addTodo(user.value.uid, { todo: newTodoTitle.value.trim() });
    newTodoTitle.value = '';
    handlePageChange(1);
  } catch (error) {
    console.error('Add todo error:', error);
    alert('Error adding todo. Please try again.');
  } finally {
    adding.value = false;
  }
};

const handleToggle = async (id: string, completed: boolean) => {
  if (!user.value) return;
  try {
    await todoService.editTodo(id, user.value.uid, { completed });
  } catch (error) {
    console.error('Toggle error:', error);
  }
};

const handleEdit = async (id: string, newText: string) => {
  if (!user.value) return;
  try {
    await todoService.editTodo(id, user.value.uid, { todo: newText });
  } catch (error) {
    console.error('Edit error:', error);
  }
};

const handleDelete = async (id: string) => {
  if (!user.value) return;
  try {
    await todoService.deleteTodo(id, user.value.uid);
  } catch (error) {
    console.error('Delete error:', error);
  }
};

const handleFilterChange = () => {
  handlePageChange(1);
};

const handlePageChange = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage.toString() } });
};
</script>