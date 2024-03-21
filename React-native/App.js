import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DieuKhienDen from './view/DieuKhienDen';

export default function App() {
  return (
    <View style={styles.container}>
      <DieuKhienDen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
