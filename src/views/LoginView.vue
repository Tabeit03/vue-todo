<template>
  <div>
    <Navbar />
    <div class="min-h-screen flex items-center justify-center bg-[#d1d186]">
      <div class="max-w-md w-full p-8 bg-[#7b7b12b6] rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              :disabled="loading"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div class="relative">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                :disabled="loading"
                class="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                tabindex="-1"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-800">
          Don't have an account? <RouterLink to="/register" class="text-gray-50 hover:text-gray-200 font-bold">Register</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { RouterLink } from 'vue-router'; 
import { useAuth } from '@/composables/useAuth';
import Navbar from '@/components/Navbar.vue';
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const router = useRouter();  // Single usage
const { reloadUser } = useAuth();

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
    reloadUser();
  } catch (err: any) {
    error.value = err.message || 'Failed to login';
  } finally {
    loading.value = false;
  }
};
</script>