import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Don't run immediately unless you're sure the layout is mounted
    setTimeout(() => {
      router.push('/login'); // or whatever route
    }, 100); // delay to ensure layout mounts
  }, []);

  return null;
}
