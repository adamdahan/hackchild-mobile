import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { request } from '../../api/client';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => request<{ todos: Todo[] }>('/v1/todos').then((r) => r.todos),
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();

  return useMutation({
    // The id is minted here, not on the server, so the optimistic row and the
    // persisted row are the same record. The server honours clientId.
    mutationFn: (title: string) => {
      const clientId = Crypto.randomUUID();
      return request<{ todo: Todo }>('/v1/todos', {
        method: 'POST',
        body: JSON.stringify({ title, clientId }),
      });
    },
    onMutate: async (title) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const previous = qc.getQueryData<Todo[]>(['todos']);
      qc.setQueryData<Todo[]>(['todos'], (old = []) => [
        { id: 'pending', title, completed: false, createdAt: new Date().toISOString() },
        ...old,
      ]);
      return { previous };
    },
    onError: (_err, _title, ctx) => {
      qc.setQueryData(['todos'], ctx?.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useCompleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(`/v1/todos/${id}/complete`, { method: 'PATCH' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['todos'] }),
  });
}
