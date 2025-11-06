import { ref, onMounted, onUnmounted } from 'vue';
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'vue-router';

export function useAuth() {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const router = useRouter();

  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = onAuthStateChanged(auth, (u) => {
      user.value = u;
      loading.value = false;
      if (!u && router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register') {
        router.push('/login');
      }
    });
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  const signOut = async () => {
    await firebaseSignOut(auth);
    user.value = null;
    router.push('/login');
  };

  const reloadUser = () => {
    onAuthStateChanged(auth, (u) => { user.value = u; });
  };

  return { user, loading, signOut, reloadUser };
}