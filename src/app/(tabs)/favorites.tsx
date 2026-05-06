import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <Text style={s.title}>Избранное</Text>
      <Text style={s.empty}>Сохраняйте виды в коллекции{'\n'}(доступно в Premium)</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8', padding: 16 },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginBottom: 20 },
  empty: { color: '#888780', fontSize: 14, textAlign: 'center', marginTop: 60, lineHeight: 22 },
});
