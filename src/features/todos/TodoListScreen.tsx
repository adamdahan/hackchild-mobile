import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCompleteTodo, useCreateTodo, useTodos } from './useTodos';

export function TodoListScreen() {
  const [title, setTitle] = useState('');
  const { data: todos = [], isLoading } = useTodos();
  const create = useCreateTodo();
  const complete = useCompleteTodo();

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Todos</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="What needs doing?"
        onSubmitEditing={() => {
          if (!title.trim()) return;
          create.mutate(title.trim());
          setTitle('');
        }}
      />

      {isLoading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => complete.mutate(item.id)}>
              <Text style={[styles.title, item.completed && styles.done]}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, gap: 12 },
  heading: { fontSize: 28, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', color: '#999' },
  muted: { color: '#999' },
});
