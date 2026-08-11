import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { TodoListScreen } from './src/features/todos/TodoListScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <TodoListScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
