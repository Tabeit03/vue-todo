<template>
  <li class="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow" role="listitem">
    <RouterLink
      :to="`/edit/${todo.id}`"
      class="flex-1 cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 p-2 rounded"
      :aria-label="`Edit ${todo.todo}`"
    >
      <span :class="todo.completed ? 'line-through text-gray-500' : 'text-gray-900'">
        {{ todo.todo }}
      </span>
    </RouterLink>
    <button
      @click="handleToggle"
      :disabled="isUpdating"
      :class="[
        'ml-4 px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        todo.completed
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200',
        { 'opacity-50': isUpdating }
      ]"
      :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
    >
      {{ isUpdating ? 'Updating...' : todo.completed ? 'Completed' : 'Incomplete' }}
    </button>
    <template v-if="isEditing">
      <input
        type="text"
        v-model="editText"
        @blur="handleEdit"
        @keydown.enter="handleEdit"
        class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
        autofocus
        :aria-label="`Editing: ${todo.todo}`"
        :disabled="isUpdating"
      />
    </template>
    <template v-else>
      <button
        @click="handleEdit"
        :disabled="isUpdating"
        class="ml-2 text-blue-700 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 text-sm disabled:opacity-50"
        :aria-label="'Edit todo inline'"
      >
        Edit
      </button>
    </template>
    <button
      @click="handleDelete"
      :disabled="isUpdating"
      class="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 px-2 py-1 text-sm disabled:opacity-50"
      :aria-label="'Delete todo'"
    >
      {{ isUpdating ? 'Deleting...' : 'Delete' }}
    </button>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

const props = defineProps<Props>();

const isEditing = ref(false);
const editText = ref(props.todo.todo);

const handleToggle = () => {
  props.onToggle(props.todo.id, !props.todo.completed);
};

const handleDelete = () => {
  if (!confirm('Delete this todo?')) return;
  props.onDelete(props.todo.id);
};

const handleEdit = () => {
  if (isEditing.value) {
    if (editText.value.trim()) {
      props.onEdit(props.todo.id, editText.value);
      isEditing.value = false;
    } else {
      isEditing.value = false;
    }
  } else {
    isEditing.value = true;
  }
};
</script>